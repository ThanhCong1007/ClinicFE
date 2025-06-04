import { mockDrugs } from './mockData';

export async function searchDrugsRxNav(query: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter mock drugs based on query
  return mockDrugs.filter(drug => 
    drug.name.toLowerCase().includes(query.toLowerCase())
  );
} 