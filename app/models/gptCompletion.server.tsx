const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);


export const summariseFeatureRequests = async (text: Array<String>) => {
    
    const prompt = `
    These are a set of feature requests for Heptabase app. Please summarise them.
    ${text.join('\n')}
    `;
    
    const response = await openai.createCompletion({
        "model": "text-davinci-002",
        "prompt": prompt,
        "user": "Unstructured-Knowledge",
        // TODO: scale max tokens to input length
        "max_tokens": 200
    })

    return response.data.choices[0].text;
}
