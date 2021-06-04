const API_URL = 'http://localhost:3000/api'
const API_VERSION = 1

const getApiUrl = (endpoint) => {
    return `${API_URL}/v${API_VERSION}${endpoint}`
}

const post = async (endpoint, body) => {
    const res = await fetch(getApiUrl(endpoint), {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }).then(res => res.json())

    if (res.status === 'error') {
        throw new Error(res.message)
    }

    return res.data
}

const get = async (endpoint) => {
    const res = await fetch(getApiUrl(endpoint)).then(res => res.json())

    if (res.status === 'error') {
        throw new Error(res.message)
    }

    return res.data
}

class ServerApi {
    static balanceOf(nickname) {
        return post('/server/balance', { nickname })
    }

    static withdraw(serverId, wallet, nickname, amount) {
        return post('/server/withdraw', {
            serverId,
            wallet,
            nickname,
            amount,
        })
    }
}

export default ServerApi
