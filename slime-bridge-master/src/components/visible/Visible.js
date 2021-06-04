import React from 'react'

const Visible = ({ isVisible = true, children }) => {
	return isVisible
		? children
		: null
}

export default Visible
