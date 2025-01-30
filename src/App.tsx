import { useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST, Attribute, GIT_HUB_NAME } from './consts';
import axios from "axios";
import { Attributes } from './types';

interface Character {
    id: string;
    name: string;
    attributes: Record<Attribute, number>;
    skills: Record<string, number>;
}
const max_attribute_points = 70;

function App() {
  const [num, setNum] = useState<number>(0);
  const [characters, setCharacters] = useState<Character[]>([
    {
    id: '1', name: 'test', attributes: {
    'Strength': 14,
        'Dexterity': 9,
        'Constitution': 9,
        'Intelligence': 9,
        'Wisdom': 9,
        'Charisma': 9,
      }, skills: {
    
  }}]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
const [totalSkillPointsToSpend, setTotalSkillPointsToSpend] = useState(0)

      // Ability Modifier Calculation
    const calculateModifier = (value: number): number => Math.floor((value - 10) / 2);
    // Handle attribute changes
    const changeAttribute = (charIndex: number, attribute: Attribute, increment: boolean) => {
        const updatedCharacters = [...characters];
        const char = updatedCharacters[charIndex];
        const currentTotal = Object.values(char.attributes).reduce((a, b) => a + b, 0);
      if (currentTotal === max_attribute_points) {
          alert(`A character can have up to ${max_attribute_points} Attribute points`)
        }
        if (increment && currentTotal < max_attribute_points) {
            char.attributes[attribute] += 1;
        } else if (!increment && char.attributes[attribute] > 0) {
            char.attributes[attribute] -= 1;
        }
      if(attribute === 'Intelligence')
          setTotalSkillPointsToSpend( 10 + 4 * calculateModifier(char.attributes.Intelligence));
        setCharacters(updatedCharacters);
    };

    // Skill Points Allocation
    const allocateSkill = (charIndex: number, skill: string, increment: boolean) => {
        const updatedCharacters = [...characters];
        const char = updatedCharacters[charIndex];
        // setTotalSkillPointsToSpend( 10 + 4 * calculateModifier(char.attributes.Intelligence));
        const totalPointsSpent = Object.values(char.skills).reduce((a, b) => a + b, 0);
      if (totalPointsSpent === totalSkillPointsToSpend) {
          alert('You need more skill points!, Upgrade intelligence to get more')
        }
        if (increment && totalPointsSpent < totalSkillPointsToSpend) {
            char.skills[skill] = (char.skills[skill] || 0) + 1;
        } else if (!increment && char.skills[skill] > 0) {
            char.skills[skill] -= 1;
        }

        setCharacters(updatedCharacters);
    };
  //  // Perform Skill Check
  //   const performSkillCheck = (charIndex: number, skill: string, modifier:number, dc: number): boolean => {
  //       const char = characters[charIndex];
  //       // const modifier = calculateModifier(char.attributes[SKILL_LIST.find((s) => s.name === skill)!.attributeModifier as Attribute]);
  //       const skillTotal = (char.skills[skill] || 0) + modifier;
  //       const roll = Math.floor(Math.random() * 20) + 1;
  //       return skillTotal + roll >= dc;
  //   };
   // Load data from the API
    const loadCharacters = async () => {
        const response = await axios.get(`https://recruiting.verylongdomaintotestwith.ca/api/${GIT_HUB_NAME}/character`);
        setCharacters(response.data || []);
    };

    // Save data to the API
    const saveCharacters = async () => {
        await axios.post(`https://recruiting.verylongdomaintotestwith.ca/api/${GIT_HUB_NAME}/character`, characters, {
            headers: { "Content-Type": "application/json" },
        });
    };
  const performMinimumCheck = (attributes: Record<Attribute, number>, characterClass: string)=>{
    const classAttributes: Attributes = CLASS_LIST[characterClass];
    const check = Object.entries(classAttributes).map(([attribute, value]) => {
      if (attributes[attribute] >= value)
        return true;
      return false
    })
    return check.every(x=>x)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
                    {/* Character Editor */}
            {characters.map((char, charIndex) => (
                <div className="characterPanels" key={char.id}>
                <div className='panel'>
                        <h2>Attributes</h2>
                  
                        {ATTRIBUTE_LIST.map((attribute) => (
                          <div key={attribute}>
                                <span>{attribute}: {char.attributes[attribute]} (Modifier: {calculateModifier(char.attributes[attribute]|| 0)})</span>
                                <button onClick={() => changeAttribute(charIndex, attribute, true)}>+</button>
                                <button onClick={() => changeAttribute(charIndex, attribute, false)}>-</button>
                            </div>
                        ))}
                </div>
                                    <div className='panel'>
                            <h2>Classes</h2>
                        {Object.keys(CLASS_LIST).map((charClass) => (
                          <div key={charClass}>
                            <span
                              onClick={()=>setSelectedClass(charClass)}
                              className={performMinimumCheck(char.attributes, charClass) ? 'selectedClass' : ''}
                            >{charClass}</span>
                            </div>
                        ))}
                </div>
                         { selectedClass?.length > 0 && <div onClick={()=>setSelectedClass('')} className='panel'>
                            <h2>{selectedClass} Minimum Requirements</h2>
                  {selectedClass?.length > 0 &&
                    <div key={`${selectedClass}_minimum_requirements`}>
                        {Object.entries(CLASS_LIST[selectedClass]).map(([attribute, attributeValue]) => (
                          <div key={attribute}>
                            <span
                            >{attribute}: {attributeValue as number}</span>
                            </div>
                        ))}
                  </div>
                  }
                    </div>}
                    <div className='panel'>
                  <h2>Skills</h2>
                  <p>Total skill points available: { 10 + 4 * calculateModifier(char.attributes.Intelligence)}</p>
                        {SKILL_LIST.map((skill) => (
                            <div key={skill.name}>
                                <span>{skill.name}: {char.skills[skill.name] || 0} (Modifier: {skill.attributeModifier}): {calculateModifier(char.attributes[skill.attributeModifier]|| 0)} </span>
                                <button onClick={() => allocateSkill(charIndex, skill.name, true)}>+</button>
                            <button onClick={() => allocateSkill(charIndex, skill.name, false)}>-</button>
                            <span>Total:{(char.skills[skill.name]|| 0) +calculateModifier(char.attributes[skill.attributeModifier]|| 0)}
                              {/* {performSkillCheck(charIndex, skill.name, calculateModifier(char.attributes[skill.attributeModifier] || 0), 0)} */}
                            </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        {/* <div>
          Value:
          {num}
          <button>+</button>
          <button>-</button>
        </div> */}
      </section>
    </div>
  );
}

export default App;
