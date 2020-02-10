import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserInstructionService, Sequence } from './user-instruction.service';
import { InstructionValidators } from './instruction-validators';

@Component({
  selector: 'app-user-instruction',
  templateUrl: './user-instruction.component.html',
  styleUrls: ['./user-instruction.component.css']
})
export class UserInstructionComponent implements OnInit {
  distanceCovered = 0;
  cleaned = false;
  instructionForm: FormGroup;

  constructor(private userInstructionService: UserInstructionService) { }

  ngOnInit() {
    this.initInstructionsForm();
  }

  initInstructionsForm() {
    this.instructionForm = new FormGroup({
      instruction: new FormControl(null, InstructionValidators.botCommandsValidators)
    });
    this.userInstructionService.distanceCovered.subscribe(distance => {
      this.cleaned = true;
      this.distanceCovered = distance;
    });
  }

  onInstructionFormSubmit() {
    if (this.instructionForm.invalid) {
      return;
    }
    const inputValue = this.instructionForm.get('instruction').value;
    const userInputSequence = this.userInstructionService.userInstructions.length;
    const instructionInput = this.instructionForm.get('instruction');
    const instructionSequence: Sequence = this.userInstructionService.getInstructionSequenceNumber(userInputSequence);

    switch (instructionSequence) {
      case Sequence.command:
        this.userInstructionService.setBotInstructionsCount(inputValue);
        instructionInput.setValidators(InstructionValidators.startingCoordinatesValidators);
        break;
      case Sequence.coordinates:
        this.userInstructionService.setBotStartingPoint(inputValue);
        instructionInput.setValidators(InstructionValidators.directionValidators);
        break;
      case Sequence.direction:
        this.userInstructionService.setBotInstructions(inputValue);
        break;
      case Sequence.final:
      default:
        this.userInstructionService.setBotInstructions(inputValue);
        instructionInput.setValidators(InstructionValidators.botCommandsValidators);
        this.userInstructionService.calculateDistanceCleaned();
    }
    this.instructionForm.reset();
  }

}
