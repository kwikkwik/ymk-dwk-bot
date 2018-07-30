class connectFour {
	static newTable(){
		const dot = '⚪';
		return [
			[dot,dot,dot,dot,dot,dot,dot],
			[dot,dot,dot,dot,dot,dot,dot],
			[dot,dot,dot,dot,dot,dot,dot],
			[dot,dot,dot,dot,dot,dot,dot],
			[dot,dot,dot,dot,dot,dot,dot],
			[dot,dot,dot,dot,dot,dot,dot]
		];
	}
	static showTable(table){
		return table.map(x => x.join(' ')).join('\n');
	}
	static addVal(table, sign, col){
		for(let i = 5; i >=0; i--){
			if(table[i][col] === '⚪'){
				table[i][col] = sign;
				return table;
			}
			return undefined;
		}
	}
	static checkWin(table, sign, winsign){
		//Horizontal
		for(let y = 0; y < 6; y++){
			for(let x = 0; x < 4; x++){
				if(table[y][x] === sign && table[y][x+1] === sign && table[y][x+2] === sign && table[y][x+3] === sign){
					table[y][x] = winsign;
					table[y][x+1] = winsign;
					table[y][x+2] = winsign;
					table[y][x+3] = winsign;
					return table;
				}
			}
		}
		//Vertical
		for(let y = 0; y < 3; y++){
			for(let x = 0; x < 7; x++){
				if(table[y][x] === sign && table[y][x+1] === sign && table[y][x+2] === sign && table[y][x+3] === sign){
					table[y][x] = winsign;
					table[y][x+1] = winsign;
					table[y][x+2] = winsign;
					table[y][x+3] = winsign;
					return table;
				}
			}
		}
		//Right Diagonal
		for(let y = 0; y < 3; y++){
			for(let x = 0; x < 4; x++){
				if(table[y][x] === sign && table[y+1][x+1] === sign && table[y+2][x+2] === sign && table[y+3][x+3] === sign){
					table[y][x] = winsign;
					table[y+1][x+1] = winsign;
					table[y+2][x+2] = winsign;
					table[y+3][x+3] = winsign;
					return table;
				}
			}
		}
		//Left Diagonal
		for(let y = 0; y < 3; y++){
			for(let x = 3; x < 7; x++){
				if(table[y][x] === sign && table[y+1][x-1] === sign && table[y+2][x-2] === sign && table[y+3][x-3] === sign){
					table[y][x] = winsign;
					table[y+1][x-1] = winsign;
					table[y+2][x-2] = winsign;
					table[y+3][x-3] = winsign;
					return table;
				}
			}
		}
		return undefined;
	}
}

module.exports = connectFour;