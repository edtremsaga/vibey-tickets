import { NextRequest, NextResponse } from 'next/server';

const TICKETMASTER_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;

export async function GET(request: NextRequest) {
  // Check if API key is configured
  if (!TICKETMASTER_API_KEY) {
    return NextResponse.json(
      { 
        error: 'TICKETMASTER_API_KEY environment variable is not set',
        hint: 'Get your API key from https://developer.ticketmaster.com/'
      },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword') || 'music';
  const city = searchParams.get('city');
  const countryCode = searchParams.get('countryCode') || 'US';
  const size = searchParams.get('size') || '20';

  try {
    // Build query parameters
    const params = new URLSearchParams({
      apikey: TICKETMASTER_API_KEY,
      keyword: keyword,
      countryCode: countryCode,
      size: size,
    });

    if (city) {
      params.append('city', city);
    }

    // Make request to Ticketmaster Discovery API
    const response = await fetch(
      `${TICKETMASTER_BASE_URL}/events.json?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          error: `Ticketmaster API error: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return formatted response
    return NextResponse.json({
      success: true,
      totalResults: data.page?.totalElements || 0,
      events: data._embedded?.events || [],
      page: data.page || {},
    });

  } catch (error) {
    console.error('Error calling Ticketmaster API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch events from Ticketmaster API',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

