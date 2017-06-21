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

The structure of the file being

```
<key>:<type>(num)
```

- `key` being the key in the mapped object and also determines the env variable used
- `type` defines the type of value this key would hold. Using shorthands, eg
  - `{}` object
  - `[<type>]` array of object
  - `+` number
  - `"` string
  - Other types can also be added

#### Todo

- [x] Parse nested objects
- [x] Parse arrays
- [ ] Support other types
- [ ] Logging
- [ ] Error Handling
- [ ] Test coverage