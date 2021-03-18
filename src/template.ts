export default function template(state) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/combine/npm/tau-prolog@0.3.0,npm/tau-prolog@0.3.0/modules/charsio.min.js,npm/tau-prolog@0.3.0/modules/dom.min.js,npm/tau-prolog@0.3.0/modules/format.min.js,npm/tau-prolog@0.3.0/modules/js.min.js,npm/tau-prolog@0.3.0/modules/lists.min.js,npm/tau-prolog@0.3.0/modules/os.min.js,npm/tau-prolog@0.3.0/modules/random.min.js,npm/tau-prolog@0.3.0/modules/statistics.min.js"></script>
          <script type="text/prolog" id="main.pl">${state.prolog}</script>
          <style>${state.css}</style>
          <script>
          window.addEventListener('load', async () => {
            try {
              const session = pl.create(${state.limit})
              await new Promise((success, error) => session.consult("main.pl", {success, error})) 
              await new Promise((success, error) => session.query("${state.query}", {success, error})) 
              session.answer({
                  success(answer) { console.log(session.format_answer(answer)) },
                  error(err) { console.warn(err) },
                  fail() { console.warn("The query was failed.") },
                  limit() { console.warn("Limit exceeded.") }
              })
            } catch (error) {
                console.warn(error)
            }
          })
          </script>
        </head>
        <body>${state.html}</body>
      </html>
    `
}