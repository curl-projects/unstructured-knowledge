const { Configuration, OpenAIApi } = require("openai");


export async function generateSearchVector(searchString){
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
  });

  const openai = new OpenAIApi(configuration);
  const response = await openai.createEmbedding({
    "model": "text-search-babbage-query-001",
    "input": searchString,
    "user": "Unstructured-Knowledge"
  })

  return response.data
}

export async function getKNNfromSearchVector(vector, topK=1){
  let url = "https://unstructured-knowledge-af6dd93.svc.us-west1-gcp.pinecone.io/query"

  let data = {
    "vector": vector,
    "includeValues": false,
    "topK": topK,
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": "ec67d11a-4487-4f47-8456-6e4ad8933c5e"
    },
    body: JSON.stringify(data)
  })

  return res.json()
  }

export async function embeddingSearch(formData){
  const searchString = await formData.get("searchString")
  const searchVectorRes = await generateSearchVector(searchString)
  const searchVector = searchVectorRes.data && searchVectorRes.data[0]['embedding']
  const knn = await getKNNfromSearchVector(searchVector, topK=4)
  const knnIDs = knn.matches
  return knnIDs
}
