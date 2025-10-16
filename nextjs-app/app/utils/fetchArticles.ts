export const fetchArticles = async ({
  category,
  type,
  page = 1,
  search,
}: {
  category?: string;
  type?: string;
  page?: number;
  search?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    params.append("page", page.toString());

    const reqUrl = `/api/articles?${params.toString()}`;
    const res = await fetch(reqUrl);
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
};
