type MachineInputCell = number | string | null;

type MachineInput = MachineInputCell[];

enum Direction {
  LEFT = '<',
  RIGHT = '>',
  STAY = '.',
}

class Program {
  constructor(
    public startingState: string,
    public endingState: string,
    public programTable: (MachineInputCell | Direction)[][],
  ) {}
}

class Tape {
  constructor(public state: MachineInput) {}
}

class TuringMachine {
  public transitions: ReturnType<TuringMachine['programToTransition']>;
  public tape: MachineInput = [];
  public head = 0;
  public currentState: ReturnType<TuringMachine['programToTransition']>[number]['fromState'];
  constructor(public program: Program) {
    this.transitions = this.programToTransition(program);

    this.currentState = program.startingState;
  }

  run(input: Tape) {
    this.tape = input.state;

    while (this.currentState !== this.program.endingState) {
      const relevantTransition = this.transitions.find(
        (transition) =>
          transition.fromState === this.currentState &&
          transition.readSymbol === this.tape[this.head],
      );

      if (!relevantTransition) {
        // console.log('no transition found');
        throw new Error('No transition found');
      }

      // console.log('transition found', relevantTransition);

      // console.log('state etc. before transition;', 'tape:', this.tape, 'head:', this.head, 'currentState:', this.currentState);

      this.tape[this.head] = relevantTransition.writeSymbol;
      if (relevantTransition.direction !== Direction.STAY) {
        this.head += relevantTransition.direction === Direction.LEFT ? -1 : 1;
      }
      this.currentState = relevantTransition.toState;

      console.log(
        'state etc. after transition;',
        'tape:',
        this.tape,
        'head:',
        this.head,
        'currentState:',
        this.currentState,
      );
    }

    return this.tape;
  }

  protected programToTransition(program: Program) {
    return program.programTable.map((programLine) => {
      const [fromState, readSymbol, toState, writeSymbol, direction] = programLine;
      return {
        fromState,
        readSymbol,
        toState,
        writeSymbol,
        direction,
      };
    });
  }

  outputFromHead(output: MachineInput) {
    return output.slice(this.head);
  }
}

// states: 'drag', 'back'
const additionMachine = new TuringMachine(
  new Program('forward', 'finish', [
    ['forward', 1, 'drag', 0, Direction.RIGHT],

    ['drag', 1, 'drag', 1, Direction.RIGHT],
    ['drag', '+', 'drag', '+', Direction.RIGHT],
    ['drag', '=', 'drag', '=', Direction.RIGHT],
    ['drag', 0, 'back', 1, Direction.LEFT],

    ['back', '=', 'back', '=', Direction.LEFT],
    ['back', 1, 'back', 1, Direction.LEFT],
    ['back', '+', 'back', '+', Direction.LEFT],
    ['back', 0, 'forward', 0, Direction.RIGHT],

    ['forward', '+', 'forward', '+', Direction.RIGHT],
    ['forward', '=', 'finish', '=', Direction.RIGHT],
  ]),
);
const additionOutput = additionMachine.run(new Tape([1, 1, 1, 0, 1, '+', 1, 1, '=', 0, 0, 0, 0, 0, 0]));

console.log('addition output full', additionOutput);
console.log('addition output', additionMachine.outputFromHead(additionOutput));


// const dataExample = new Tape([0, 0, 0, 1, 0]);
// const programExample = new Program('even', 'finish', [
//   ['even', 0, 'odd', 0, Direction.RIGHT],
//   ['odd', 0, 'even', 0, Direction.RIGHT],
//   ['even', 1, 'finish', 'N', Direction.STAY],
//   ['odd', 1, 'finish', 'Y', Direction.STAY],
// ]);

// const machine = new TuringMachine(programExample);
// // console.log("🚀 ~ file: script.ts:85 ~ machine:", machine)

// const output = machine.run(dataExample);

// console.log('output full', output);
// console.log('output from head', machine.outputFromHead(output))
