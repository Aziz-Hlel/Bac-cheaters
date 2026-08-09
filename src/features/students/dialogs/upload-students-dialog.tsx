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
import { UploadExcel } from "../components/stepper/01-upload-excel"
import MapColumns from "../components/stepper/02-map-columns"
import MapRows from "../components/stepper/03-map-rows"
import MapVioltationDuration from "../components/stepper/04-map-violtation-duration"
import ConfirmExamples from "../components/stepper/05-confirm-examples"
import ExtractStudents from "../components/stepper/06-extract-students"
import type { KeysToExcelColumnsInput } from "../schemas/keysToExcelColumns"
import type { FirstAndLastRowInput } from "../schemas/mapFirstAndLastRow"
import type { MapPunishmentDurationInput } from "../schemas/mapPunishmentDuration"
import { useSetDialogState } from "../store/useDialogStore"

const steps = [1, 2, 3, 4, 5, 6, 7]
const stepsNames = ['اختيار الدورة', 'اختيار الملف', 'اختيار الأعمدة', 'اختيار الصفوف', 'تأكيد مدة العقوبات', 'تأكيد الأمثلة', 'استخراج الطلاب']

const UploadStudentsDialogMain = () => {

  const setDialogOpen = useSetDialogState();

  const handleCancel = () => {
    setDialogOpen(null)
  }

  const [schoolYear, setSchoolYear] = useState<number>(2020)
  const [, setExcelFile] = useState<File | null>(null)
  const [excelArrayBuffer, setExcelArrayBuffer] = useState<ArrayBuffer | null>(null)
  const [sheetNumber, setSheetNumber] = useState<number>(0);
  const [violationsDuration, setViolationsDuration] = useState<Record<string, number | null> | null>(null)

  const [columns, setColumns] = useState<KeysToExcelColumnsInput | null>(null)
  const [rows, setRows] = useState<FirstAndLastRowInput | null>(null)


  const handlePickSchoolYearStep = (schoolYear: number) => {
    setSchoolYear(schoolYear)
    setCurrentStep(2)
  }

  const handleUploadStep = async (file: File, sheetNumber: number) => {
    setExcelFile(file);
    setExcelArrayBuffer(await file.arrayBuffer())
    setSheetNumber(sheetNumber)
    setCurrentStep(3);
  }

  const handleMapColumnsStep = (columns: KeysToExcelColumnsInput) => {
    setColumns(columns);
    setCurrentStep(4);
  }

  const handleMapRowsStep = (rows: FirstAndLastRowInput) => {
    setRows(rows);
    setCurrentStep(5);
  }

  const handleMapViolationsDurationStep = (violationsDuration: MapPunishmentDurationInput) => {
    const formattedDuration = violationsDuration.reduce((acc, violation) => {
      acc[violation.text] = violation.value;
      return acc;
    }, {} as Record<string, number | null>)
    setViolationsDuration(formattedDuration);
    setCurrentStep(6);
  }

  const handleConfirmExamplesStep = () => {
    setCurrentStep(7);
  }

  const handleAddStudentsStep = () => {
    handleCancel();
  }

  const [currentStep, setCurrentStep] = useState(1)
  return (
    <Dialog open onOpenChange={handleCancel}>
      <DialogContent className='min-w-4xl max-h-[calc(100dvh-6rem)] min-h-8/12 flex flex-col'>

        <div className="flex  items-center justify-center px-8">
          <Stepper
            className="flex flex-col items-center justify-center gap-10"
            value={currentStep}
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
              {stepsNames.map((_, index) => (
                <StepperItem key={index + 1} step={index + 1} loading={index + 1 === currentStep}>
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
              {stepsNames.map((stepName, index) => (
                <StepperContent key={index} value={index + 1}>
                  <Label>
                    {stepName}
                  </Label>
                </StepperContent>
              ))}
            </StepperPanel>
          </Stepper>
        </div>

        <Separator orientation="horizontal" className="h-0.5 " />

        <div className=" flex-1 flex items-center justify-center">
          {currentStep === 1 && <PickSchoolYear handlePickSchoolYearStep={handlePickSchoolYearStep} />}
          {currentStep === 2 && <UploadExcel handleUploadStep={handleUploadStep} />}
          {currentStep === 3 && <MapColumns handleMapColumnsStep={handleMapColumnsStep} />}
          {currentStep === 4 && <MapRows handleMapRowsStep={handleMapRowsStep} />}
          {currentStep === 5 && <MapVioltationDuration excelArrayBuffer={excelArrayBuffer!} firstAndLastRow={rows!} violationColumn={columns!.violation!} scheetNumber={sheetNumber} handleMapViolationsDurationStep={handleMapViolationsDurationStep} />}
          {currentStep === 6 && <ConfirmExamples scheetNumber={sheetNumber} excelArrayBuffer={excelArrayBuffer!} firstAndLastRow={rows!} columns={columns!} violationsDuration={violationsDuration!} handleConfirmExamplesStep={handleConfirmExamplesStep} />}
          {currentStep === 7 && <ExtractStudents schoolYear={schoolYear} excelArrayBuffer={excelArrayBuffer!} firstAndLastRow={rows!} columns={columns!} violationsDuration={violationsDuration!} sheetNumber={sheetNumber} handleAddStudentsStep={handleAddStudentsStep} />}
        </div>
      </DialogContent>

    </Dialog>
  )
}

export default UploadStudentsDialogMain