// 서버에 요청하는 함수 라이브러리
const server = process.env.REACT_APP_SERVER;

/* USER */
export async function creatUser(email, fullName, username, password){
    const res = await fetch(`${server}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            email,
            fullName,
            username,
            password
        })
    });

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 로그인
export async function signIn(email, password) {
    const res = await fetch(`${server}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 정보 수정
export async function updateProfile(formData) {
    const res = await fetch(`${server}/user`, {
        method: "PUT",
        headers: { "Authoriztion": "Bearer" + JSON.parse(localStorage.getItem("user")).token},
        body: formData
    })

    if (!res.ok) {
        throw new Error( `${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 유저 검색
export async function searchUsers(username) {
    const res = await fetch(`${server}/users/?username=${username}`, {
        headers: { "Authorization":"bearer" + JSON.parse(localStorage.getItem("user").token)}
    });

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// 이메일로 유저 검색
export async function doesEmailExisis(email) {
    const res = await fetch(`${server}/users/?email=${emial}`);

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    const { userCount } = await res.json();

    return userCount > 0;
}

/* ARTICLE */

/* COMMNTS */

/* PROFILES */