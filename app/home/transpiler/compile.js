const compilers = {}

function compile(tree) {
  if (typeof tree != 'object') {
    return tree
  }

  let output = ''

  tree.forEach(branch => {
    output += create(branch)
  })

  return output
}

function create(tree) {
  const {type} = tree

  if (compilers[type]) {
    return compilers[type](tree)
  } else {
    console.log('No compiler', tree);
  }
}

function preCompile() {
  let out = ''

  Object.keys(invertedInputs).forEach(name => {
    out += `${name} := ${invertedInputs[name]} = 0;\n`
  })

  return out + '\n'
}
