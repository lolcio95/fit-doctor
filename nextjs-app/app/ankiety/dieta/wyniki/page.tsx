'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DietRecommendation {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealPlan: string[];
  tips: string[];
}

export default function DietResultsPage() {
  const [recommendations, setRecommendations] = useState<DietRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pobierz rekomendacje z localStorage lub API
    const savedRecommendations = localStorage.getItem('dietRecommendations');
    if (savedRecommendations) {
      setRecommendations(JSON.parse(savedRecommendations));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generowanie Twoich rekomendacji...</p>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Brak danych</h2>
            <p className="text-gray-600 mb-4">
              Nie znaleziono wyników ankiety. Wypełnij ankietę ponownie.
            </p>
            <Button onClick={() => window.location.href = '/ankiety/dieta'}>
              Wróć do ankiety
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    // Tutaj można dodać generowanie PDF
    alert('Funkcja generowania PDF będzie dostępna wkrótce');
  };

  const handleOrderDiet = () => {
    // Przekierowanie do checkout/zamówienia diety
    window.location.href = '/pakiety?service=dieta';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Twoje Rekomendacje Dietetyczne</h1>
          <p className="text-gray-600">
            Na podstawie Twoich odpowiedzi przygotowaliśmy spersonalizowany plan żywienia
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Makroskładniki */}
          <Card>
            <CardHeader>
              <CardTitle>Dzienne Zapotrzebowanie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="font-medium">Kalorie</span>
                  <span className="text-xl font-bold text-blue-600">
                    {recommendations.calories} kcal
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-medium">Białko</div>
                    <div className="text-green-600 font-bold">{recommendations.protein}g</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <div className="font-medium">Węglowodany</div>
                    <div className="text-orange-600 font-bold">{recommendations.carbs}g</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="font-medium">Tłuszcze</div>
                    <div className="text-purple-600 font-bold">{recommendations.fats}g</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Porady */}
          <Card>
            <CardHeader>
              <CardTitle>Ważne Porady</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Plan posiłków */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Przykładowy Plan Posiłków</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {recommendations.mealPlan.map((meal, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                  {meal}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Akcje */}
        <div className="text-center space-x-4">
          <Button onClick={handleDownloadPDF} variant="outline">
            Pobierz PDF
          </Button>
          <Button onClick={handleOrderDiet} className="bg-blue-600 text-white">
            Zamów Spersonalizowaną Dietę
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Uwaga:</strong> Te rekomendacje są wstępne i bazują na ogólnych wytycznych. 
            Dla otrzymania pełnego, spersonalizowanego planu żywieniowego skonsultuj się z naszymi 
            dietetykami.
          </p>
        </div>
      </div>
    </div>
  );
}