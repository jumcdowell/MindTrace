"use client";

import { useState, useEffect } from 'react';
import { Header, Card, Button } from '@/components';
import { supabase } from '@/lib/supabase';

interface TestCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration_minutes: number;
  is_active: boolean;
}

interface TestQuestion {
  id: string;
  category_id: string;
  question_text: string;
  difficulty: string;
  order_index: number;
  is_active: boolean;
}

export default function ContentManagementPage() {
  const [categories, setCategories] = useState<TestCategory[]>([]);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: '🧩',
    duration_minutes: 3,
  });

  const [newQuestion, setNewQuestion] = useState({
    category_id: '',
    question_text: '',
    difficulty: 'medium',
    order_index: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('test_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('test_questions')
        .select('*')
        .eq('category_id', categoryId)
        .order('order_index');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('test_categories')
        .insert([newCategory]);

      if (error) throw error;

      setNewCategory({ name: '', description: '', icon: '🧩', duration_minutes: 3 });
      setShowAddCategory(false);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      const { error } = await supabase
        .from('test_questions')
        .insert([{
          ...newQuestion,
          category_id: selectedCategory,
        }]);

      if (error) throw error;

      setNewQuestion({ category_id: '', question_text: '', difficulty: 'medium', order_index: 0 });
      setShowAddQuestion(false);
      fetchQuestions(selectedCategory);
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to add question');
    }
  };

  const handleCategoryClick = (category: TestCategory) => {
    setSelectedCategory(category.id);
    fetchQuestions(category.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-base flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-text-muted">Loading content management system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-base">
      <Header currentPath="/admin/content" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-text-main mb-2">
              Content Management System
            </h1>
            <p className="text-lg text-text-muted">
              Manage test categories and questions
            </p>
          </div>
          <Button onClick={() => setShowAddCategory(true)}>
            + Add Category
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-text-main mb-4">Test Categories</h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  hover
                  className={`p-4 cursor-pointer ${
                    selectedCategory === category.id ? 'border-slate-blue' : ''
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-semibold text-text-main">{category.name}</h3>
                      <p className="text-sm text-text-muted">
                        {category.duration_minutes} mins
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-main">
                {selectedCategory ? 'Questions' : 'Select a category'}
              </h2>
              {selectedCategory && (
                <Button
                  variant="secondary"
                  onClick={() => setShowAddQuestion(true)}
                >
                  + Add Question
                </Button>
              )}
            </div>

            {selectedCategory ? (
              <div className="space-y-3">
                {questions.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-text-muted">No questions yet. Add your first question!</p>
                  </Card>
                ) : (
                  questions.map((question) => (
                    <Card key={question.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-text-main mb-2">{question.question_text}</p>
                          <div className="flex gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-cream-card-hover text-text-muted">
                              {question.difficulty}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-cream-card-hover text-text-muted">
                              Order: {question.order_index}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-text-muted">
                  Select a category to view and manage its questions
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Add Category Modal */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-text-main mb-4">Add New Category</h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    required
                    className="w-full h-14 px-4 text-lg rounded-xl border-2 border-cream-border bg-white focus:border-slate-blue focus:outline-none focus:ring-2 focus:ring-slate-blue-light transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">Description</label>
                  <input
                    type="text"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="w-full h-14 px-4 text-lg rounded-xl border-2 border-cream-border bg-white focus:border-slate-blue focus:outline-none focus:ring-2 focus:ring-slate-blue-light transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">Icon (emoji)</label>
                  <input
                    type="text"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                    className="w-full h-14 px-4 text-lg rounded-xl border-2 border-cream-border bg-white focus:border-slate-blue focus:outline-none focus:ring-2 focus:ring-slate-blue-light transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newCategory.duration_minutes}
                    onChange={(e) => setNewCategory({ ...newCategory, duration_minutes: parseInt(e.target.value) })}
                    required
                    className="w-full h-14 px-4 text-lg rounded-xl border-2 border-cream-border bg-white focus:border-slate-blue focus:outline-none focus:ring-2 focus:ring-slate-blue-light transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Add Category
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setShowAddCategory(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Add Question Modal */}
        {showAddQuestion && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-text-main mb-4">Add New Question</h3>
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">Question Text</label>
                  <input
                    type="text"
                    value={newQuestion.question_text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                    required
                    className="w-full h-14 px-4 text-lg rounded-xl border-2 border-cream-border bg-white focus:border-slate-blue focus:outline-none focus:ring-2 focus:ring-slate-blue-light transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">
                    Difficulty
                  </label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                    className="w-full h-14 px-4 text-lg rounded-xl border-2 border-cream-border bg-white focus:border-slate-blue focus:outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">Order Index</label>
                  <input
                    type="number"
                    value={newQuestion.order_index}
                    onChange={(e) => setNewQuestion({ ...newQuestion, order_index: parseInt(e.target.value) })}
                    required
                    className="w-full h-14 px-4 text-lg rounded-xl border-2 border-cream-border bg-white focus:border-slate-blue focus:outline-none focus:ring-2 focus:ring-slate-blue-light transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Add Question
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setShowAddQuestion(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
