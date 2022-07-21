# RISC-F

RISC-Fritz Description

## Memory organization

| Name           |Range                          |Purpose                         |
|----------------|-------------------------------|-----------------------------|
|EEPROM		 	 |0x0000-0x3FFF = 16Kb        	 |Read only memory, program            |
|TILESET         |0x4000-0x4FFF = 8kB     		 |Used to store TILESET (128x8x8)            |
|VRAM         	 |0x6000-0x7FFF = 8kB     	 	 |VGA Display (640x480 = 60*80)           |
|RAM         	 |0x8000-0xFE00 = 32kB 			 |RAM|
|I/O         	 |0xFF00-0xFFFF = 256B			 |Memory mapped I/O|

Flag register, interrupt register can be found in the I/O address space

## REGISTERS

6 General register => A, B, C, SI, DI
Stack pointer => SP
Program counter => PC
Zero register => PC used as second operand (B-BUS)

## Flags
CF => Carry Flag
ZF => Zero Flag
NF => Negative Flag (Necessary?)
N^V => Negative ^ Overflow => Singed comparison

## Instruction Set

| Mnemonic           |Example                          |Description                         |
|----------------|-------------------------------|-----------------------------|
|add	 	 |add a, b        	 |A = A + B            |

//TODO: Complete table