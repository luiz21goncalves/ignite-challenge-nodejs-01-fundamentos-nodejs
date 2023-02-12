import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvParse = parse({
  delimiter: ',',
  skip_empty_lines: true,
  from_line: 2,
})

const stream = fs.createReadStream(new URL('./tasks.csv', import.meta.url))

async function main() {
  const lines = stream.pipe(csvParse)

  for await (const line of lines) {
    const [title, description] = line

    console.log({ title, description })

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    })

    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

main()
