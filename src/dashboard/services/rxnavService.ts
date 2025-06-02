import axios from 'axios';

export async function searchDrugsRxNav(query: string) {
  // 1. Tìm các RxCUI gần đúng với từ khóa
  const approxRes = await axios.get(`https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encodeURIComponent(query)}`);
  const candidates = approxRes.data?.approximateGroup?.candidate || [];
  if (!candidates.length) return [];

  // 2. Lấy thông tin chi tiết từng RxCUI
  const results = await Promise.all(
    candidates.slice(0, 10).map(async (c: any) => {
      try {
        const rxcui = c.rxcui;
        const propRes = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/allProperties.json?prop=names`);
        const props = propRes.data?.propConceptGroup?.propConcept || [];
        // Lấy tên thuốc, dạng bào chế nếu có
        const name = props.find((p: any) => p.propCategory === 'NAME')?.propValue || '';
        const doseForm = props.find((p: any) => p.propCategory === 'DF')?.propValue || '';
        return {
          rxcui,
          name,
          doseFormName: doseForm
        };
      } catch {
        return null;
      }
    })
  );
  return results.filter(Boolean);
} 