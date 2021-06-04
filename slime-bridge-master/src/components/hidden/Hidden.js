import React from 'react'

import Visible from '../visible/Visible'

const Hidden = ({ isHidden = true, children }) => {
	return <Visible isVisible={!isHidden}>{children}</Visible>
}

export default Hidden
