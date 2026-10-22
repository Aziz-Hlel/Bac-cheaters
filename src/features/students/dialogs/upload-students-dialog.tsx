import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/components/reui/stepper"
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckIcon, LoaderCircleIcon } from "lucide-react"
import { useState } from "react"
import PickSchoolYear from "../components/stepper/00-school-year"
import TutorialVideo from "../components/stepper/00-tutorial-video"
import { UploadExcel } from "../components/stepper/01-upload-excel"
import MapColumns from "../components/stepper/02-map-columns"
import MapRows from "../components/stepper/03-map-rows"
import MapVioltationDuration from "../components/stepper/04-map-violtation-duration"
import ConfirmExamples from "../components/stepper/05-confirm-examples"
import ExtractStudents from "../components/stepper/06-extract-students"
import { ExcelWorkerProvider } from "../context/excel-worker-context"
import type { KeysToExcelColumnsInput } from "../schemas/keysToExcelColumns"
import type { FirstAndLastRowInput } from "../schemas/mapFirstAndLastRow"
import type { MapPunishmentDurationInput } from "../schemas/mapPunishmentDuration"
import { useSetDialogState } from "../store/useDialogStore"

const steps = [
  { id: 'tutorial-video', name: 'شرح توضيحي' },
  { id: 'school-year', name: 'اختيار الدورة' },
  { id: 'upload-excel', name: 'اختيار الملف' },
  { id: 'map-columns', name: 'اختيار الأعمدة' },
  { id: 'map-rows', name: 'اختيار الصفوف' },
  { id: 'map-duration', name: 'تأكيد مدة العقوبات' },
  { id: 'confirm-examples', name: 'تأكيد الأمثلة' },
  { id: 'extract-students', name: 'استخراج الطلاب' },
] as const


const UploadStudentsDialogMain = () => {

  const setDialogOpen = useSetDialogState();

  const handleCancel = () => {
    setDialogOpen(null)
  }

  const [schoolYear, setSchoolYear] = useState<number>(2020)
  const [sheetNumber, setSheetNumber] = useState<number>(0);
  const [violationsDuration, setViolationsDuration] = useState<Record<string, number | null> | null>(null)

  const [columns, setColumns] = useState<KeysToExcelColumnsInput | null>(null)
  const [rows, setRows] = useState<FirstAndLastRowInput | null>(null)

  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const nextStep = () => setCurrentStepIndex((i) => Math.min(i + 1, steps.length));

  const handleTutorialStep = () => {
    nextStep();
  }

  const handlePickSchoolYearStep = (schoolYear: number) => {
    setSchoolYear(schoolYear)
    nextStep()
  }

  const handleUploadStep = (sheetNumber: number) => {
    setSheetNumber(sheetNumber);
    nextStep();
  }

  const handleMapColumnsStep = (columns: KeysToExcelColumnsInput) => {
    setColumns(columns);
    nextStep();
  }

  const handleMapRowsStep = (rows: FirstAndLastRowInput) => {
    setRows(rows);
    nextStep();
  }

  const handleMapViolationsDurationStep = (violationsDuration: MapPunishmentDurationInput) => {
    const formattedDuration = violationsDuration.reduce((acc, violation) => {
      acc[violation.text] = violation.value;
      return acc;
    }, {} as Record<string, number | null>)
    setViolationsDuration(formattedDuration);
    console.log("1")
    nextStep();
  }

  const handleConfirmExamplesStep = () => {
    nextStep();
  }

  const handleAddStudentsStep = () => {
    handleCancel();
  }

  const activeStep = steps[currentStepIndex]

  const renderCurrentStep = () => {
    switch (activeStep.id) {
      case 'tutorial-video':
        return <TutorialVideo onSkip={handleTutorialStep} />
      case 'school-year':
        return <PickSchoolYear handlePickSchoolYearStep={handlePickSchoolYearStep} />
      case 'upload-excel':
        return <UploadExcel handleUploadStep={handleUploadStep} />
      case 'map-columns':
        return <MapColumns handleMapColumnsStep={handleMapColumnsStep} />
      case 'map-rows':
        return <MapRows handleMapRowsStep={handleMapRowsStep} />
      case 'map-duration':
        return (
          <MapVioltationDuration
            firstAndLastRow={rows!}
            violationColumn={columns!.violation!}
            scheetNumber={sheetNumber}
            handleMapViolationsDurationStep={handleMapViolationsDurationStep}
          />
        )
      case 'confirm-examples':
        return (
          <ConfirmExamples
            scheetNumber={sheetNumber}
            firstAndLastRow={rows!}
            columns={columns!}
            violationsDuration={violationsDuration!}
            handleConfirmExamplesStep={handleConfirmExamplesStep}
          />
        )
      case 'extract-students':
        return (
          <ExtractStudents
            schoolYear={schoolYear}
            firstAndLastRow={rows!}
            columns={columns!}
            violationsDuration={violationsDuration!}
            sheetNumber={sheetNumber}
            handleAddStudentsStep={handleAddStudentsStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <Dialog open onOpenChange={handleCancel} disablePointerDismissal >
      <ExcelWorkerProvider>
        <DialogContent className='min-w-4xl max-h-[calc(100dvh-6rem)] min-h-8/12 flex flex-col'>

          <div className="flex  items-center justify-center px-8">
            <Stepper
              className="flex flex-col items-center justify-center gap-10"
              value={currentStepIndex + 1}
              orientation="horizontal"
              indicators={{
                completed: (
                  <CheckIcon className="size-3.5 " />
                ),
                loading: (
                  <LoaderCircleIcon className="size-3.5 animate-spin" />
                ),
              }}
            >
              <StepperNav>
                {steps.map((step, index) => (
                  <StepperItem key={step.id} step={index + 1} loading={index + 1 === currentStepIndex}>
                    <StepperTrigger>
                      <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white">
                        {index + 1}
                      </StepperIndicator>
                    </StepperTrigger>
                    {steps.length > index + 1 && (
                      <StepperSeparator className="group-data-[state=completed]/step:bg-success data-[state=completed]:bg-green-500" />
                    )}
                  </StepperItem>
                ))}
              </StepperNav>

              <StepperPanel className="w-32 text-center text-sm">
                {steps.map((step, index) => (
                  <StepperContent key={step.id} value={index + 1}>
                    <Label>
                      {step.name}
                    </Label>
                  </StepperContent>
                ))}
              </StepperPanel>
            </Stepper>
          </div>

          <Separator orientation="horizontal" className="h-0.5 " />

          <div className=" flex-1 min-h-0 flex items-center justify-center overflow-hidden overflow-y-auto ">
            {/*
            {activeStep.id === 'tutorial-video' && <TutorialVideo onSkip={handleTutorialStep}/>}

            {activeStep.id === 'school-year' &&
              <PickSchoolYear handlePickSchoolYearStep={handlePickSchoolYearStep} />}

            {activeStep.id === 'upload-excel' &&
              <UploadExcel handleUploadStep={handleUploadStep} />}

            {activeStep.id === 'map-columns' &&
              <MapColumns handleMapColumnsStep={handleMapColumnsStep} />}

            {activeStep.id === 'map-rows' &&
              <MapRows handleMapRowsStep={handleMapRowsStep} />}

            {activeStep.id === 'map-duration' &&
              (
                <MapVioltationDuration
                  firstAndLastRow={rows!}
                  violationColumn={columns!.violation!}
                  scheetNumber={sheetNumber}
                  handleMapViolationsDurationStep={handleMapViolationsDurationStep}
                />
              )}
            {activeStep.id === 'confirm-examples' &&
              (
                <ConfirmExamples
                  scheetNumber={sheetNumber}
                  firstAndLastRow={rows!}
                  columns={columns!}
                  violationsDuration={violationsDuration!}
                  handleConfirmExamplesStep={handleConfirmExamplesStep}
                />
              )}
            {activeStep.id === 'extract-students' && (
              <ExtractStudents
                schoolYear={schoolYear}
                firstAndLastRow={rows!}
                columns={columns!}
                violationsDuration={violationsDuration!}
                sheetNumber={sheetNumber}
                handleAddStudentsStep={handleAddStudentsStep}
              />
            )} */}

            {renderCurrentStep()}
          </div>
        </DialogContent>
      </ExcelWorkerProvider>
    </Dialog>
  )
}

export default UploadStudentsDialogMain