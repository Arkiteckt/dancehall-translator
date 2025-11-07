# Change state declaration if it uses currentStep
s/const \[currentStep, setCurrentStep\]/const [currentView, setCurrentView]/
# Change all setCurrentStep to setCurrentView
s/setCurrentStep/setCurrentView/g
# Change all currentStep references to currentView
s/currentStep ===/currentView ===/g
s/currentStep =/currentView =/g
