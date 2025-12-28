import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';
import fs from 'node:fs';

const SWAGGER_URL = process.env.SWAGGER_URL || "https://raw.githubusercontent.com/ProjectDistribute/distributor/refs/heads/main/docs/swagger.json";

async function main() {
    console.log("Fetching Swagger from:", SWAGGER_URL);
    console.log("Is using GITHUB_TOKEN:", process.env.GITHUB_TOKEN ? "yes" : "no");

    const response = await fetch(SWAGGER_URL, {
        headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`
        }
    });
    if (!response.ok) throw new Error(`Failed to fetch swagger: ${response.statusText}`);

    const data = await response.json();

    fs.writeFileSync('./content/api/swagger.json', JSON.stringify(data, null, 2));
    console.log("File saved to ./content/api/swagger.json");

    const openapi = createOpenAPI({
        input: ['./content/api/swagger.json'],
    })
    await generateFiles({
        input: openapi,
        output: './content/docs/distributor/',
        includeDescription: true,
    });
}

main().catch(console.error);