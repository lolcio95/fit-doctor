'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SurveyStep {
  id: string;
  title: string;
  questions: Question[];
}

interface Question {
  id: string;
  type: 'radio' | 'checkbox' | 'text' | 'number';
  label: string;
  options?: string[];
  required?: boolean;
}

const surveySteps: SurveyStep[] = [
  {
    id: 'basic-info',
    title: 'Podstawowe informacje',
    questions: [
      {
        id: 'age',
        type: 'number',
        label: 'Wiek',
        required: true
      },
      {
        id: 'gender',
        type: 'radio',
        label: 'Płeć',
        options: ['Kobieta', 'Mężczyzna'],
        required: true
      },
      {
        id: 'activity-level',
        type: 'radio',
        label: 'Poziom aktywności',
        options: ['Siedzący tryb życia', 'Lekko aktywny', 'Umiarkowanie aktywny', 'Bardzo aktywny'],
        required: true
      }
    ]
  },
  {
    id: 'diet-goals',
    title: 'Cele dietetyczne',
    questions: [
      {
        id: 'main-goal',
        type: 'radio',
        label: 'Główny cel',
        options: ['Utrata wagi', 'Przyrost masy mięśniowej', 'Utrzymanie wagi', 'Poprawa zdrowia'],
        required: true
      },
      {
        id: 'target-weight',
        type: 'number',
        label: 'Docelowa waga (kg)',
        required: false
      }
    ]
  },
  {
    id: 'preferences',
    title: 'Preferencje żywieniowe',
    questions: [
      {
        id: 'diet-type',
        type: 'checkbox',
        label: 'Typ diety (możesz wybrać kilka)',
        options: ['Wegetariańska', 'Wegańska', 'Keto', 'Paleo', 'Śródziemnomorska', 'Bez ograniczeń']
      },
      {
        id: 'allergies',
        type: 'text',
        label: 'Alergie i nietolerancje (oddziel przecinkami)',
        required: false
      }
    ]
  }
];

export default function DietSurveyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentStep + 1) / surveySteps.length) * 100;
  const isLastStep = currentStep === surveySteps.length - 1;

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const validateCurrentStep = () => {
    const currentQuestions = surveySteps[currentStep].questions;
    return currentQuestions.every(q => 
      !q.required || (responses[q.id] !== undefined && responses[q.id] !== '')
    );
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      alert('Wypełnij wszystkie wymagane pola');
      return;
    }

    if (isLastStep) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/surveys/diet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(responses)
        });
        
        if (response.ok) {
          window.location.href = '/ankiety/dieta/wyniki';
        }
      } catch (error) {
        alert('Wystąpił błąd podczas zapisywania');
      }
      setIsSubmitting(false);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={responses[question.id] === option}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                  className="form-radio"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={responses[question.id]?.includes(option) || false}
                  onChange={(e) => {
                    const current = responses[question.id] || [];
                    const newValue = e.target.checked 
                      ? [...current, option]
                      : current.filter((v: string) => v !== option);
                    handleResponse(question.id, newValue);
                  }}
                  className="form-checkbox"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={responses[question.id] || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Wprowadź liczbę"
          />
        );
      
      case 'text':
        return (
          <textarea
            value={responses[question.id] || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Wprowadź tekst"
            rows={3}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Ankieta Dietetyczna</h1>
          <Progress value={progress} className="w-full" />
          <p className="text-center mt-2 text-gray-600">
            Krok {currentStep + 1} z {surveySteps.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{surveySteps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {surveySteps[currentStep].questions.map(question => (
              <div key={question.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderQuestion(question)}
              </div>
            ))}
            
            <div className="flex justify-between pt-6">
              <Button 
                onClick={handlePrevious} 
                disabled={currentStep === 0}
                variant="outline"
              >
                Poprzedni
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Zapisywanie...' : isLastStep ? 'Zakończ ankietę' : 'Następny'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}