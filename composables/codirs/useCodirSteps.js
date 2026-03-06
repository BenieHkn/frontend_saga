export function useCodirSteps(id) {
  const router = useRouter()

  const STEP_KEY = `codir_step_${id}`

  const steps = [
    { id: 1, label: 'Ordres du jour' },
    { id: 2, label: 'Informations générales' },
    { id: 3, label: 'PV du codir' },
  ]

  const currentStep = ref(1)

  const saveStep = (step) => {
    currentStep.value = step
    if (process.client)
      localStorage.setItem(STEP_KEY, String(step))
  }

  const navigateToStep = (step) => {
    if (step === 1) router.push(`/codir/${id}`)
    if (step === 2) router.push(`/codir/infos`)
    if (step === 3) router.push(`/codir/preview`)
  }

  const goNext = () => {
    if (currentStep.value < steps.length) {
      saveStep(currentStep.value + 1)
      navigateToStep(currentStep.value)
    }
  }

  const goPrev = () => {
    if (currentStep.value > 1) {
      saveStep(currentStep.value - 1)
      navigateToStep(currentStep.value)
    }
  }

  const finish = () => {
    saveStep(1)
    router.push('/codir')
  }

  const updateStoredStep = (stepCurrent) => {
    if (process.client) {
      const saved = localStorage.getItem(STEP_KEY)
      localStorage.setItem(STEP_KEY, String(stepCurrent.value))
    }
  }

  const restoreStep = () => {
    if (process.client) {
      const saved = localStorage.getItem(STEP_KEY)
      if (saved) currentStep.value = Number(saved)
    }
  }

  return {
    steps,
    currentStep,
    saveStep,
    goNext,
    goPrev,
    finish,
    restoreStep,
  }
}