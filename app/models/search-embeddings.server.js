export async function generateSearchVector(searchString){
  let url = "https://api.openai.com/v1/embeddings"

  let data = {
    "model": "text-search-babbage-query-001",
    "input": searchString
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer" + process.env.OPENAI_KEY,
      "Content-Type": 'application/json'
    },
    body: JSON.stringify(data)
  })

  return res.json()
}

export async function getKNNfromSearchVector(vector, topK=1){
  let url = "https://embedding-db-ea3137b.svc.us-west1-gcp.pinecone.io/query"

  let data = {
    "vector": vector,
    "includeValues": false,
    "topK": topK,
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": process.env.PINECONE_KEY
    },
    body: JSON.stringify(data)
  })

  return res.json()
  }
