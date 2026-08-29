# DevLens

A lightweight, modern API client built for developers.

DevLens is a browser-based alternative to tools such as Postman and Insomnia, focused on a clean interface, fast request workflows, maintainable architecture, and a polished developer experience.

> DevLens is currently under active development.

---

## Overview

DevLens allows developers to create HTTP requests, configure request data, inspect responses, manage request history, organize saved requests, and work with environment variables.

The project is being built as a production-style React application with a strong focus on:

- Clean and maintainable architecture
- Reusable components
- Type safety
- Request and response handling
- Form validation
- Testing
- Responsive design
- Performance
- Developer experience

---

## Planned Features

### HTTP Requests

- GET
- POST
- PUT
- PATCH
- DELETE
- Request cancellation
- Request duration measurement
- HTTP and network error handling

### Request Configuration

- Query Params
- Headers
- JSON Body
- Text Body
- Authentication

Supported authentication methods:

- No Auth
- Bearer Token
- Basic Auth
- API Key

### Response Viewer

- HTTP status
- Response time
- Response size
- Pretty JSON viewer
- Raw response viewer
- Response headers
- Copy response
- Syntax highlighting

### Request History

- Automatically save executed requests
- Search request history
- Filter by HTTP method
- Reopen previous requests
- Clear history

### Collections

- Create collections
- Save requests
- Organize requests by collection
- Rename and delete collections
- Reopen saved requests

### Environments

Environment variables will support values such as:

```text
{{baseUrl}}/users/{{userId}}
```
