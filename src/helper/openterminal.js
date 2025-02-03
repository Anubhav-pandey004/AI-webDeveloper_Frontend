const openTerminal = ()=>{
        const terminalEl = document.querySelector('.terminal');
        const terminal = new Terminal({
            convertEol: true,
        });
        terminal.open(terminalEl);
        return terminal
    }

    export default openTerminal