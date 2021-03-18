<script lang="ts">
	import template from './template'
	const getOrElse = (url: URL, key: string, defaultValue: string) =>
  		url?.searchParams.has(key) ? url.searchParams.get(key) : defaultValue
	let url = new URL(window.location.href)
	let html = getOrElse(url, 'html', '<h1>Hello Prolog</h1>')
    let css= getOrElse(url, 'css', 'h1 { color= red; }')
    let prolog= getOrElse(url, 'prolog', 'main.')
    let query= getOrElse(url, 'query', 'main.')
    let limit= parseInt(getOrElse(url, 'limit', '1000'))
	let tabs = ['Result', 'HTML', 'CSS', 'Prolog', 'MISC']
	let tab = 'Result'
	$: srcDoc = template({html, css, prolog, query, limit})
	$: {
		const {protocol, host, pathname} = window.location
		const obj = {query, limit, html, css, prolog}
		const props = Object.entries(obj).map(kv=>kv.map(encodeURIComponent).join('=')).join('&')
		url = new URL(protocol+'//'+host+pathname+'?'+props)
	}
</script>

<style>
	.tabbar {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
	}
	.tab > input {
		opacity: 0;
	}
	.app {
		height: 100%;
		display: grid;
		grid-template-rows: 40px 1fr;
	}
	.body {
		padding: 10px;
		display: grid;
	}
	.tab {
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 3px solid lightgray;
	}
	.tab.active {
		border-color: olivedrab;
	}
	textarea {
		padding: 5px;
		font-family: 'Courier New', Courier, monospace;
		border: 1px solid lightgray;
		border-radius: 3px
	}
	iframe {
		height: 100%;
		width:  100%;
		border: 1px solid lightgray;
		border-radius: 3px;
	}
	form {
		padding: 10px;
		border: 1px solid lightgray;
		border-radius: 3px;
	}
	form label {
		display: block;
	}
	form input {
		width: 100%;
	}
</style>

<div class="app">
	<div class="tabbar">
		{#each tabs as value}
		<label class="tab {tab === value ? 'active' : ''}">
			<input type="radio" bind:group={tab} {value}/> {value}
		</label>
		{/each}
	</div>

	<div class="body">
		{#if tab === 'MISC'}
		<form>
			<label>URL<br /><input readonly value={url.toString()} /></label>
			<label>Query<br /><input bind:value={query} /></label>
			<label>Limit<br /><input bind:value={limit} /></label>
		</form>
		{:else if tab === 'HTML'}
		<textarea bind:value={html} />
		{:else if tab === 'CSS'}
		<textarea bind:value={css} />
		{:else if tab === 'Prolog'}
		<textarea bind:value={prolog} />
		{:else}
		<iframe title="Result" {srcDoc} />
		{/if}
	</div>
</div>