import { generateSearchVector, getKNNfromSearchVector } from "~/models/search-embeddings.server"

export async function embeddingSearch(formData){
  const filterType = formData.get('filterType')

  const searchString = await formData.get("searchString")
  const searchVectorRes = await generateSearchVector(searchString)
  const searchVector = searchVectorRes.data && searchVectorRes.data[0]['embedding']
  const knn = await getKNNfromSearchVector(searchVector, topK=100)
  const knnIDs = knn.matches
  return knnIDs
}
