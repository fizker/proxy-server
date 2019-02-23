// @flow

import * as React from 'react'

type Props = {|
	onCreate: (url:string) => void,
|}
export default function CreateServerView({ onCreate }:Props) {
	const [ url, setURL ] = React.useState('')

	return <form onSubmit={(e) => {e.preventDefault();onCreate(url)}}>
		<input
			value={url}
			onChange={e => setURL(e.currentTarget.value)}
		/>
		<button>
			Create destination
		</button>
	</form>
}
