import 'isomorphic-fetch';

export const exists = name => {
    return fetch('/api/exists/'+name)
            .then(res => res.json())
            .then(result => result.exists);
}
