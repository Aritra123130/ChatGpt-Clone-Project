// Import the Pinecone library
const { Pinecone } = require( '@pinecone-database/pinecone');

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.Pine_Cone_Api_Key });

const cohortChatgptIndex = pc.index('cohort-chat-gpt');

// vector.service.js
async function createMemory({ vectors, metadata, messageId }) {
  // ensure vectors is an array of numbers (one vector) or an array of vectors depending on your use
  console.log('createMemory got:', { messageId, vectors, metadata });

    await cohortChatgptIndex.upsert([ 
            {
                id: messageId.toString(), // Ensure ID is a string
                values: vectors,          // The long array of floats you showed me
                metadata: metadata        // The chat/user object
            }
        ]);
}


async function queryMemory({ queryVector, limit = 5, metadata }) {

    const data = await cohortChatgptIndex.query({
        vector: queryVector,
        topK: limit,
        filter: metadata ? metadata : undefined,
        includeMetadata: true
    })

    return data.matches

}

module.exports = { createMemory, queryMemory }