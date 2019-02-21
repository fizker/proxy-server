// @flow

import * as React from 'react'
import urlModule from 'url'

type Props = {|
	url: string,
	onChangeUrl: (string) => void,
	ip: string,
|}
type State = {|
	url: ?string,
|}

export default class Url extends React.Component<Props, State> {
	state = {
		url: null,
	}

	render() {
		var url = this.getURL() || {}

		return <form onSubmit={this.onSubmit}>
			<input
				value={this.state.url == null ? this.props.url || '' : this.state.url}
				onChange={this.onChange}
			/>
			<button
				disabled={this.state.url == null}
				type="button"
				onClick={()=>this.setState({ url: null })}
			>
				Reset
			</button>
			<button disabled={this.state.url == null}>Change url</button>
			{this.props.ip && <div>
				Your current ip: {this.props.ip}
				<button
					type="button"
					onClick={this.onUseIPClicked}
					disabled={url.host == this.props.ip}
				>
					Use this
				</button>
			</div>}
		</form>
	}

	getURL() : ?url$urlObject {
		const url = this.state.url == null || this.state.url === '' ? this.props.url : this.state.url
		return Boolean(url) ? urlModule.parse(url) : null
	}
	useIP() : void {
		var url = this.getURL()
		var newState
		if(url) {
			url = {
				...url,
				host: this.props.ip,
			}
			newState = urlModule.format(url).replace(/\/$/, '')
		} else {
			newState = 'http://' + this.props.ip
		}

		this.setState({ url: newState }, ()=>this.onSubmit())
	}
	onUseIPClicked = (e:SyntheticEvent<HTMLFormElement>) : void => {
		e.preventDefault()
		this.useIP()
	}
	onChange = (e:SyntheticEvent<HTMLInputElement>) : void => {
		let newUrl = e.currentTarget.value
		if(newUrl == this.props.url) {
			newUrl = null
		}
		this.setState({ url: newUrl })
	}
	onSubmit = (e?:SyntheticEvent<HTMLFormElement>) : void => {
		e && e.preventDefault()

		var newUrl = this.state.url

		if(newUrl === '') {
			newUrl = null
		}

		if(newUrl != null && !/^[a-z][a-z0-9_]+:\/\//.test(newUrl)) {
			newUrl = 'http://' + newUrl
		}

		if(newUrl !== this.state.url) {
			this.setState({ url: newUrl })
		}

		if(this.props.onChangeUrl && newUrl != this.props.url && newUrl != null) {
			this.props.onChangeUrl(newUrl)
		}
	}
}
