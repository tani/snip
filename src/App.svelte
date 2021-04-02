<script lang="ts">
	import template from './template'
	const getOrElse = (url: URL, key: string, defaultValue: string) =>
  		url?.searchParams.has(key) ? url.searchParams.get(key) : defaultValue
	let url = new URL(window.location.href)
	let html = getOrElse(url, 'html', '<h1>Hello Prolog</h1>')
    let css= getOrElse(url, 'css', 'h1 { color: red; }')
    let prolog= getOrElse(url, 'prolog', 'main.')
    let query= getOrElse(url, 'query', 'main.')
    let limit= parseInt(getOrElse(url, 'limit', '1000'))
	let ready = true
	const handleInput = () => ready = true
	const tabs = ['Result', 'HTML', 'CSS', 'Prolog', 'MISC']
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
	.ready {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.ready button {
		background-color: olivedrab;
		border: none;
		width: 50px;
		height: 50px;
		clip-path: polygon(0% 0%, 0% 100%, 100% 50%);
	}
	.ready button:hover {
		background-color: 60px solid olive;
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
	form input {
		display: block;
		width: 100%;
		border: 1px solid lightgray;
		border-radius: 3px
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
			<label>Query<br /><input type="text" bind:value={query} on:input={handleInput} /></label>
			<label>Limit<br /><input type="number" bind:value={limit} on:input={handleInput} /></label>
		</form>
		{:else if tab === 'HTML'}
		<textarea bind:value={html} on:input={handleInput}/>
		{:else if tab === 'CSS'}
		<textarea bind:value={css} on:input={handleInput}/>
		{:else if tab === 'Prolog'}
		<textarea bind:value={prolog} on:input={handleInput}/>
		{:else if tab === 'Result' && !ready}
		<iframe title="Result" {srcDoc} />
		{:else if tab === 'Result' && ready}
		<div class="ready">
			<button on:click={()=>ready=false} />
		</div>
		{/if}
	</div>
</div>
