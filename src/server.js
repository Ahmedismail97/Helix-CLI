import fs from "node:fs/promises"
import http from "node:http"
import open from "open"

const interpolate = (html, data) => {
  // The replace method is used to replace a substring of a string with another string.
  // The first argument is a regular expression that matches the placeholders in the HTML template.
  // The second argument is a function that will be called for each match.
  // The function receives the match and the placeholder name as arguments.
  // The function returns the value of the placeholder from the data object or an empty string if the placeholder is not found.
  //{{ notes }} => data.notes
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || '';
  });
}

export const formatNote = notes => {
  return notes.map(note => {
    return `
    <p class="note"> ${note.content} </p>
    <div class="tags">
      ${note.tags.map(tag => `<span class="tag">${tag}</span>`)}
    </div>`
  }).join('\n') //join() method joins all elements of an array into a string.
}

export const createServer = notes => {
  return http.createServer(async (req, res) => {
    const HTML_PATH = new URL('./template.html', import.meta.url);
    const template = await fs.readFile(HTML_PATH, 'utf-8');
    const html = interpolate(template, { notes: formatNote(notes) });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  })
}

export const start = (notes, port) => {
  const server = createServer(notes);

  server.listen(port, () => {
    const address = `http://localhost:${port}`;
    console.log(`Server running at ${address}`);

    open(address); //open the browser with the address provided in the argument.
  })
}