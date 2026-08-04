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
import { Separator } from "@/components/ui/separator"
import { CheckIcon, LoaderCircleIcon } from "lucide-react"
import { useState } from "react"
import { UploadExcel } from "../components/stepper/01-upload-excel"
import MapColumns from "../components/stepper/02-map-columns"
import type { KeysToExcelColumnsInput } from "../schemas/keysToExcelColumns"
import type { FirstAndLastRowInput } from "../schemas/mapFirstAndLastRow"
import { useSetDialogOpen } from "../store/useDialogStore"
import MapRows from "../components/stepper/03-map-rows"

const steps = [1, 2, 3]

const UploadStudentsDialogMain = () => {

  const setDialogOpen = useSetDialogOpen();

  const handleCancel = () => {
    setDialogOpen(null)
  }

  const [, setExcelFile] = useState<File | null>(null)
  const [, setColumns] = useState<KeysToExcelColumnsInput | null>(null)
  const [rows, setRows] = useState<FirstAndLastRowInput | null>(null)

  const handleUploadStep = (file: File) => {
    setExcelFile(file);
    setCurrentStep(2);
  }

  const handleMapColumnsStep = (columns: KeysToExcelColumnsInput) => {
    setColumns(columns);
    setCurrentStep(3);
  }

  const handleMapRowsStep = (rows: FirstAndLastRowInput) => {
    setRows(rows);
    setCurrentStep(4);
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
              {steps.map((step) => (
                <StepperItem key={step} step={step} loading={step === currentStep}>
                  <StepperTrigger>
                    <StepperIndicator className="data-[state=completed]:bg-success data-[state=completed]:text-white">
                      {step}
                    </StepperIndicator>
                  </StepperTrigger>
                  {steps.length > step && (
                    <StepperSeparator className="group-data-[state=completed]/step:bg-success" />
                  )}
                </StepperItem>
              ))}
            </StepperNav>

            <StepperPanel className="w-32 text-center text-sm">
              {steps.map((step) => (
                <StepperContent key={step} value={step}>
                  Step {step} content
                </StepperContent>
              ))}
            </StepperPanel>
          </Stepper>
        </div>

        <Separator orientation="horizontal" className="h-0.5 " />

        <div className=" flex-1 flex items-center justify-center">
          {currentStep === 1 && <UploadExcel handleUploadStep={handleUploadStep} />}
          {currentStep === 2 && <MapColumns handleMapColumnsStep={handleMapColumnsStep} />}
          {currentStep === 3 && <MapRows handleMapRowsStep={handleMapRowsStep} />}
        </div>

      </DialogContent>

    </Dialog>
  )
}

export default UploadStudentsDialogMain