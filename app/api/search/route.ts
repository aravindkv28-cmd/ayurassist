// app/api/search/route.ts

import { NextResponse } from 'next/server';
import Fuse from 'fuse.js';
// NerPipeline import is removed

// --- DATABASE (Hardcoded to guarantee it works) ---
const db = [
  {
    id: 1,
    disease_name: 'Cough',
    ayurvedic_term: 'Kasa',
    snomed_code: '284196006',
    patient_explanation: 'A cough (Kasa) is a reflex action to clear your airways of mucus and irritants such as dust or smoke.'
  },
  {
    id: 2,
    disease_name: 'Fever',
    ayurvedic_term: 'Jvara',
    snomed_code: '386661006',
    patient_explanation: 'A fever (Jvara) is when your body temperature is higher than normal. It is a common sign of infection.'
  },
  {
    id: 3,
    disease_name: 'Diabetes',
    ayurvedic_term: 'Madhumeha',
    snomed_code: '73211009',
    patient_explanation: 'Diabetes (Madhumeha) is a chronic condition where the body cannot control the amount of sugar in the blood.'
  },
  {
    id: 4,
    disease_name: 'Arthritis',
    ayurvedic_term: 'Sandhivata',
    snomed_code: '84229003',
    patient_explanation: 'Arthritis (Sandhivata) causes pain, swelling, and stiffness in the joints, often related to inflammation.'
  },
  {
    id: 5,
    disease_name: 'Headache',
    ayurvedic_term: 'Shirahshula',
    snomed_code: '25064002',
    patient_explanation: 'A headache (Shirahshula) is a pain or discomfort in the head or scalp. It can be a symptom of stress, migraine, or other issues.'
  }
];
// --- END DATABASE ---

// --- FUSE SEARCH CONFIG ---
const fuse = new Fuse(db, {
  keys: ['disease_name', 'ayurvedic_term'],
  includeScore: true,
  threshold: 0.3,
  isCaseSensitive: false,
});

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    console.log(`🔍 Query: "${query}"`);

    // --- All NER code is removed ---

    // We only do the direct Fuse.js search
    console.log('🔍 Using direct search');
    const searchResults = fuse.search(query);
    const allResults: any[] = [];

    for (const result of searchResults) {
      allResults.push(result.item);
    }

    console.log(`✅ Found ${allResults.length} results`);
    return NextResponse.json(allResults);

  } catch (error) {
    console.error("❌ Search error:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 });
  }
}