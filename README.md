# Did you mean *[Levenshtein](https://en.wikipedia.org/wiki/Levenshtein_distance)* ?


## Installing

    npm install


## Running

    npm run start


## Testing

    npm run test


## Endpoints

- **GET** `/words`: List all stored words

- **PUT** `/words`: Store one word

- **GET** `/retrieve`: List all stored words corresponding to a keyword and threshold (3 if omitted), sorted by proximity
    - `keyword`
    - `threshold` *(optional)*
