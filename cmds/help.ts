const menus: {
  [key: string]: string
} = {
  main: `
                cliboardy [command] <options>
        
                copy ............... copy content. ex: echo 123 | clipboardy copy
                paste .............. paste last content saved in server
                help ............... show help menu for a command`,

  copy: `
    clipboardy copy 

    copy content. ex: echo 123 | clipboardy copy
    `,

  paste: `
    clipboardy paste 
    paste last content saved in server
                `,
}

module.exports = (args: any) => {
  const subCmd = args._[0] === "help" ? args._[1] : args._[0]

  console.log(menus[subCmd] || menus.main)
}
