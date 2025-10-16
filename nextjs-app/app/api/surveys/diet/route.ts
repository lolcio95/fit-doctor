import { NextRequest, NextResponse } from 'next/server';

interface SurveyResponse {
  age: string;
  gender: string;
  'activity-level': string;
  'main-goal': string;
  'target-weight'?: string;
  'diet-type': string[];
  allergies?: string;
}

interface DietRecommendation {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealPlan: string[];
  tips: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SurveyResponse = await request.json();
    
    // Walidacja podstawowych pól
    if (!body.age || !body.gender || !body['activity-level'] || !body['main-goal']) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych pól ankiety' },
        { status: 400 }
      );
    }

    // Zapisanie do bazy danych (tymczasowo w pamięci/localStorage)
    const responseId = Date.now().toString();
    
    // Można dodać integrację z Sanity:
    // const client = createClient({...});
    // await client.create({
    //   _type: 'surveyResponse',
    //   responseId,
    //   ...body,
    //   createdAt: new Date()
    // });

    // Generowanie rekomendacji na podstawie odpowiedzi
    const recommendations = generateRecommendations(body);
    
    return NextResponse.json({
      success: true,
      responseId,
      recommendations
    });
    
  } catch (error) {
    console.error('Błąd podczas przetwarzania ankiety:', error);
    return NextResponse.json(
      { error: 'Wewnętrzny błąd serwera' },
      { status: 500 }
    );
  }
}

function generateRecommendations(response: SurveyResponse): DietRecommendation {
  const age = parseInt(response.age);
  const activityMultipliers = {
    'Siedzący tryb życia': 1.2,
    'Lekko aktywny': 1.375,
    'Umiarkowanie aktywny': 1.55,
    'Bardzo aktywny': 1.725
  };

  // Podstawowe BMR (uproszczony wzór)
  let bmr = response.gender === 'Mężczyzna' 
    ? 88.362 + (13.397 * 70) + (4.799 * 175) - (5.677 * age) // Przykładowe wartości
    : 447.593 + (9.247 * 60) + (3.098 * 165) - (4.330 * age);

  const activityLevel = response['activity-level'] as keyof typeof activityMultipliers;
  const totalCalories = Math.round(bmr * activityMultipliers[activityLevel]);

  // Dostosowanie kalorii do celu
  let adjustedCalories = totalCalories;
  if (response['main-goal'] === 'Utrata wagi') {
    adjustedCalories = Math.round(totalCalories * 0.85); // Deficyt 15%
  } else if (response['main-goal'] === 'Przyrost masy mięśniowej') {
    adjustedCalories = Math.round(totalCalories * 1.15); // Nadwyżka 15%
  }

  // Makroskładniki
  const protein = Math.round(adjustedCalories * 0.25 / 4); // 25% kalorii z białka
  const fats = Math.round(adjustedCalories * 0.25 / 9); // 25% z tłuszczów
  const carbs = Math.round((adjustedCalories - (protein * 4) - (fats * 9)) / 4);

  // Przykładowe posiłki na podstawie preferencji dietetycznych
  let mealPlan = [
    'Śniadanie: Owsianka z owocami i orzechami',
    'Drugie śniadanie: Jogurt grecki z jagodami',
    'Obiad: Grillowana pierś z kurczaka z ryżem i warzywami',
    'Podwieczorek: Smoothie białkowe',
    'Kolacja: Łosoś z batatami i sałatką'
  ];

  // Dostosowanie do typu diety
  if (response['diet-type']?.includes('Wegańska')) {
    mealPlan = [
      'Śniadanie: Owsianka na mleku roślinnym z nasionami chia',
      'Drugie śniadanie: Hummus z warzywami',
      'Obiad: Tofu z quinoa i warzywami na parze',
      'Podwieczorek: Smoothie z białkiem roślinnym',
      'Kolacja: Sałatka z soczewicą i awokado'
    ];
  }

  const tips = [
    'Pij co najmniej 2-3 litry wody dziennie',
    'Jedz regularnie co 3-4 godziny',
    'Włącz do diety różnokolorowe warzywa i owoce',
    'Monitoruj postępy i dostosowuj dietę w razie potrzeby'
  ];

  return {
    calories: adjustedCalories,
    protein,
    carbs,
    fats,
    mealPlan,
    tips
  };
}