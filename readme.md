> **Work In Progress**

#### Idea

Mapping configuration environment variables into a js object or array. Given a string like

```
db:{}
  host:"
  port:+
secret:"
id:+
```

The module will look for the following environment variables
- `DB_HOST` # '127.0.0.1'
- `DB_PORT` # 27017
- `SECRET` # 'youcantseeme'
- `ID` # 10

And produce an object as

```js
{
  db: {
    host: '127.0.0.1',
    port: 27017,
  }
  secret: 'youcantseeme',
  id: 10,
}
```