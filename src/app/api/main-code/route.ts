import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get('lang');
  const id = searchParams.get('id');

  // Validate query parameters
  if (!lang || !id) {
    return NextResponse.json({ message: 'Missing required query parameters: lang, id' }, { status: 400 });
  }

  const validLangs = ['java', 'cpp', 'python'];
  if (!validLangs.includes(lang.toLowerCase())) {
    return NextResponse.json({ message: `Invalid language. Supported languages: ${validLangs.join(', ')}` }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'src', 'data', `${lang.toLowerCase()}main.json`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ 
        message: `Main code file not found for language: ${lang}`,
        filePath: filePath // Include for debugging in development
      }, { status: 404 });
    }

    // Read and parse JSON file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let mainCodes;
    try {
      mainCodes = JSON.parse(fileContent);
    } catch (parseError) {
      console.error(`Error parsing JSON file ${filePath}:`, parseError);
      return NextResponse.json({ message: 'Invalid JSON format in main code file' }, { status: 500 });
    }

    // Check if code exists for the given ID
    const code = mainCodes[id];
    if (!code) {
      return NextResponse.json({ 
        message: `Main code not found for problem ID: ${id} in ${lang}`,
        availableIds: Object.keys(mainCodes) // Helpful for debugging
      }, { status: 404 });
    }

    return NextResponse.json({ code });
  } catch (error) {
    console.error(`Error fetching main code for lang=${lang}, id=${id}:`, error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}