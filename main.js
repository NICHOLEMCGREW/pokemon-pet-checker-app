//fetch using pokemonapi.co
document.querySelector('button').addEventListener('click', getPokemon)

function getPokemon() {
    const choice = document.querySelector('input').value
    const url = `https://pokeapi.co/api/v2/pokemon/${choice}`

    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        const potentialPet = new Poke (data.name, data.height, data.weight, data.types,data.sprites.other['official-artwork'].front_default)
        potentialPet.getTypes()
        potentialPet.isItHousepet()
        let decision = ''
        if (potentialPet.housepet) {
            decision = `This Pokemon is small enough, light enough, and safe enough to be a good house pet!`
        } else {
            decision = `This Pokemon would not be a good house pet because ${potentialPet.reason.join(' and ')}.`
        }
        document.querySelector('h2').innerText = decision;
        document.querySelector('img').src = potentialPet.image
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
}

class Poke {
    constructor(name, height, weight, types, image) {
        this.name = name
        this.height = height
        this.weight = weight
        this.types = types
        this.image = image
        this.housepet = true
        this.reason = []
        this.typeList = []
    }

    getTypes() {
        for (const property of this.types) {
            this.typeList.push(property.type.name)
        }
        console.log(this.typeList)
    }

    weightToPounds(bacon) {
        return Math.round((bacon/4.536)*100)/100
    }

    heightToFeet(height) {
        return Math.round((height/3.048)*100)/100
    }

    isItHousepet() {
        //check height, weight, and types
        let badTypes = ['fire', 'electric', 'fighting', 'poison', 'ghost']
        if (this.weightToPounds(this.weight) > 400) {
            this.reason.push(`It is too heavy at ${this.weightToPounds(this.weight)} pounds`)
            this.housepet = false
        }
        if (this.heightToFeet(this.height) > 7) {
            this.reason.push(`It is too tall at ${this.heightToFeet(this.height)} feet`)
            this.housepet = false
        }
        if (badTypes.some(r=> this.typeList.indexOf(r) >= 0)) {
            this.reason.push(`The ${this.types} type is too dangerous`)
            this.housepet = false
        }
    }
}