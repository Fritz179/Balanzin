/*
TEST 1: Math and conditionals
a += b - (1 - 2) * 2
a++
if (a != b && !c) {
  c %= 5
  if (1 >= 2) {
    adsf = asdf
  } else if (1 + 1 = 3) {
    asdf = adsf
  } else if (1 + 1 = 2) {
    1 = 2
  } else {
    a = b
  }
} else {
 b = c
}
*/

/*
TEST 2: await
await 2s {
  a!!
  b = 44
}

c = 9

await 2s
b!!
b = 44
c = 9
*/

/*
TEST 3: process
process(1) {
  await 2s
  led1 = 1
  await 2s
  led2 = 1
  await 2s
  led1 = 0
  led2 = 0
}
*/

/*
TEST 4: Piston

piston(armHorizontal, out(horOut), 2s, in(horOut))
piston(armVertical, out(verOut), out(verIn), in(verIn), 3s)

process(#active) {
  await true
        #bandFree = false
  await armVertical.extend()
  await armVertical.retract()
        #bandFree = true
  await armHorizontal.extend()
  await armVertical.extend()
        mx_isEmpty = ix_isEmpty
  await armVertical.retract()
  await armHorizontal.retract()
        #bandFree = false
  await armVertical.extend()
  await armVertical.extend()
        #bandFree = true
  }


*/

/*
  await waits condition and then goes to the next await
  arace can win before previous await is done, calls next argument
  if next aurgument is subprocess resume current process after execution otherwise exit process

  await || arace wait for next process to not be keptAlive before initializing it

*/

`
process main(tileIn) {
  await band.right()
  arace 2s repeat()
  await piston.in()
  await isRed || isGreen || isBlue
  arace 2s
  await goRest()

}

// subprocess repeat() {
//   await piston.in()
//   await piston.out()
// }
//
process repeat() {
  await piston.in()
  await piston.out()
}

`
