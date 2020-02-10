import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInstructionComponent } from './user-instruction.component';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { UserInstructionService, Sequence } from './user-instruction.service';
import { By } from '@angular/platform-browser';


describe('UserInstructionComponent', () => {
  let component: UserInstructionComponent;
  let fixture: ComponentFixture<UserInstructionComponent>;
  let instructionService: UserInstructionService;
  let form: FormGroup;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ UserInstructionComponent ],
      providers: [UserInstructionService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInstructionComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    instructionService = TestBed.get(UserInstructionService);
    form = component.instructionForm;
    jasmine.clock().install();
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should render form', () => {
    expect(form).toBeTruthy();
  });

  it('should not have default input value', () => {
    expect(form.get('instruction').value).toBe(null);
  });

  it('should render input element', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input[id="robot-input"]');
    expect(input).toBeTruthy();
  });

  it('should test default form validity', () => {
    expect(form.valid).toBeFalsy();
  });

  it('should test user input required', () => {
    const instructionInput = form.get('instruction');
    expect(instructionInput.errors.required).toBeTruthy();
    instructionInput.setValue('10');
    expect(instructionInput.errors).toBeNull();
  });

  describe('UserInstructionService', () => {
    it('should receive a valid user input for number of robot commands', () => {
      const instructionInput = form.get('instruction');
      instructionInput.setValue('10000');
      expect(instructionInput.value).toBeLessThanOrEqual(10000);
      expect(instructionInput.valid).toBeTruthy();
      expect(form.valid).toBeTruthy();
    });

    it('should categorize the type of instruction sequence', () => {

      let instructionSequence = instructionService.userInstructions.length;
      let sequence = instructionService.getInstructionSequenceNumber(instructionSequence);
      expect(sequence).toBe(Sequence.command);

      instructionService.userInstructions.push('2');
      instructionSequence = instructionService.userInstructions.length;
      sequence = instructionService.getInstructionSequenceNumber(instructionSequence);
      expect(sequence).toBe(Sequence.coordinates);

    });

    it('should set no of robot commands', () => {
      instructionService.setBotInstructionsCount('2');
      expect(instructionService.userInstructions.length).toBe(1);
      expect(instructionService.botInstructionsCount).toBe(2);
    });

    it('should set robot starting point', () => {
      const startingPoint = '10 12';
      const currentPoint = {
        xPosition: 10,
        yPosition: 12
      };
      instructionService.setBotStartingPoint(startingPoint);
      expect(instructionService.startingPoint.xPosition).toBe(10);
      expect(instructionService.startingPoint.yPosition).toBe(12);
      expect(instructionService.currentPoint).toEqual(currentPoint);
    });

    describe('robot instructions', () => {
      it('should traverse robot path', () => {
        const direction = 'E';
        const distance = 1;
        const currentPoint = {
          xPosition: 11,
          yPosition: 12
        };
        instructionService.currentPoint = {
          xPosition: 10,
          yPosition: 12
        };
        instructionService.traversePath(direction, distance);
        expect(instructionService.currentPoint).toEqual(currentPoint);
      });

      it('should set robot instructions', () => {
        const currentPoint = {
          xPosition: 15,
          yPosition: 12
        };
        instructionService.botInstructionSequence = 0;
        instructionService.botInstructionsCount = 2;
        instructionService.currentPoint = {
          xPosition: 10,
          yPosition: 12
        };
        instructionService.setBotInstructions('E 5');
        expect(instructionService.currentPoint).toEqual(currentPoint);
        expect(instructionService.botInstructionSequence).toBe(1);
      });

      it('should stay inside the bounds', () => {
        let currentPoint = {
          xPosition: 15,
          yPosition: -100000
        };
        instructionService.botInstructionSequence = 0;
        instructionService.botInstructionsCount = 2;
        instructionService.currentPoint = {
          xPosition: 15,
          yPosition: -100000
        };
        instructionService.setBotInstructions('S 14');
        expect(instructionService.currentPoint).toEqual(currentPoint);
        expect(instructionService.botInstructionSequence).toBe(1);
        instructionService.setBotInstructions('E 11');
        currentPoint = {
          xPosition: 26,
          yPosition: -100000
        };
        expect(instructionService.currentPoint).toEqual(currentPoint);
        expect(instructionService.botInstructionSequence).toBe(2);
      });
    });

    describe('robot\'s distance cleaned', () => {
      it('should track distance cleaned', () => {
        let distanceCovered = 0;
        component.cleaned = true;
        fixture.detectChanges();
        instructionService.pathCoordinates = [
          [10, 12], [11, 12], [12, 12], [13, 12], [14, 12], [14, 12], [14, 13], [14, 14]
        ];
        instructionService.distanceCovered.subscribe(d => distanceCovered = d);
        instructionService.calculateDistanceCleaned();
        expect(distanceCovered).toBe(7);
        expect(instructionService.userInstructions.length).toBe(0);
      });
    });

    describe('reset', () => {
      it('should reset values after the robot commands', () => {
        instructionService.botInstructionSequence = 2;
        instructionService.pathCoordinates = [
          [10, 12], [11, 12], [12, 12], [13, 12], [14, 12]
        ];
        instructionService.userInstructions = ['2', '10 12', 'E 1', 'N 5'];
        instructionService.resetInstructionsSequence();
        expect(instructionService.botInstructionSequence).toBe(0);
        expect(instructionService.userInstructions.length).toBe(0);
        expect(instructionService.pathCoordinates.length).toBe(0);
      });
    });
  });
});
