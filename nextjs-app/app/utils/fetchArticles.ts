export const fetchArticles = async ({category, type, page = 1}:{category?: string; type?: string, page?: number}) => {
  try {
    const reqUrl = category
    ? `/api/articles?category=${category}&type=${type}&page=${page}`
    : `/api/articles?type=${type}&page=${page}`;
    const res = await fetch(reqUrl);
    const data = await res.json();

    return data;
  } catch (error){
    console.error(error);
    
    return [];
  }
};
