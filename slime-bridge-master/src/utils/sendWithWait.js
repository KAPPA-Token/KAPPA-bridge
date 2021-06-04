import { toast } from 'react-toastify'

const sendWithWait = (txPromise) => {
    return txPromise.then((tx) => {
        toast.info('Transaction sended. Wait for confirmation')

        return tx.wait()
            .then(txHash => {
                if (txHash.status === 1) {
                    return toast.success('Success! Transaction confirmed!')
                }
                
                toast.error('Error! Transaction not confirmed!')
            })
            .catch(err => toast.error(err.message))
    })
}

export default sendWithWait
