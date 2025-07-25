// Enhanced JavaScript with Modern Features
let currentStep = 1
const totalSteps = 5
let selectedTemplates = []
let formData = {}
let educationCount = 1
let experienceCount = 1
let languageCount = 3
let userPhoto = null

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  updateProgress()
  setupEventListeners()
  initializeDropdowns()
  setupPhotoUpload()
})

// Setup event listeners
function setupEventListeners() {
  // Form validation on input
  const inputs = document.querySelectorAll("input, select, textarea")
  inputs.forEach((input) => {
    input.addEventListener("blur", validateField)
    input.addEventListener("input", handleInputChange)
  })

  // Handle current job checkbox
  document.addEventListener("change", (e) => {
    if (e.target.name && e.target.name.includes("current")) {
      const endDateInput = e.target.closest(".experience-item").querySelector('input[name*="endDate"]')
      if (e.target.checked) {
        endDateInput.disabled = true
        endDateInput.value = ""
        endDateInput.style.opacity = "0.5"
      } else {
        endDateInput.disabled = false
        endDateInput.style.opacity = "1"
      }
    }
  })

  // Mobile menu toggle
  const mobileToggle = document.querySelector(".mobile-menu-toggle")
  const nav = document.querySelector(".nav")

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      nav.classList.toggle("mobile-active")
    })
  }
}

// Initialize dropdown functionality
function initializeDropdowns() {
  const dropdownTriggers = document.querySelectorAll(".dropdown-trigger")

  dropdownTriggers.forEach((trigger) => {
    const dropdown = trigger.closest(".nav-dropdown")
    const menu = dropdown.querySelector(".dropdown-menu")

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        menu.style.opacity = "0"
        menu.style.visibility = "hidden"
        menu.style.transform = "translateY(-10px)"
      }
    })
  })
}

// Setup photo upload functionality
function setupPhotoUpload() {
  const photoInput = document.getElementById("photoInput")
  const photoPreview = document.getElementById("photoPreview")
  const removeBtn = document.querySelector(".btn-remove")

  if (photoInput) {
    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        handlePhotoUpload(file)
      }
    })
  }
}

// Handle photo upload
function handlePhotoUpload(file) {
  // Validate file
  if (!file.type.startsWith("image/")) {
    showNotification("Veuillez sélectionner un fichier image valide", "error")
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB limit
    showNotification("La taille du fichier ne doit pas dépasser 5MB", "error")
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    userPhoto = e.target.result
    displayPhotoPreview(e.target.result)
    showNotification("Photo ajoutée avec succès", "success")
  }
  reader.readAsDataURL(file)
}

// Display photo preview
function displayPhotoPreview(imageSrc) {
  const photoPreview = document.getElementById("photoPreview")
  const removeBtn = document.querySelector(".btn-remove")

  photoPreview.innerHTML = `<img src="${imageSrc}" alt="Photo de profil">`
  removeBtn.style.display = "inline-flex"
}

// Remove photo
function removePhoto() {
  const photoPreview = document.getElementById("photoPreview")
  const removeBtn = document.querySelector(".btn-remove")
  const photoInput = document.getElementById("photoInput")

  photoPreview.innerHTML = `
        <div class="photo-placeholder">
            <i class="fas fa-user"></i>
            <p>Aucune photo</p>
        </div>
    `

  removeBtn.style.display = "none"
  photoInput.value = ""
  userPhoto = null

  showNotification("Photo supprimée", "info")
}

// Start CV creation process
function startCreation() {
  document.getElementById("home").style.display = "none"
  document.getElementById("cv-form").style.display = "block"
  document.getElementById("cv-form").classList.add("fade-in")

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// Show templates section
function showTemplates() {
  const templatesSection = document.getElementById("cv-preview")
  if (templatesSection.style.display === "none") {
    // Generate dummy data for preview
    formData = {
      firstName: "Ahmed",
      lastName: "Ben Ali",
      email: "ahmed.benali@email.com",
      phone: "+216 XX XXX XXX",
      profileType: "professionnel",
      objective: "Professionnel expérimenté cherchant de nouveaux défis...",
    }

    document.getElementById("home").style.display = "none"
    templatesSection.style.display = "block"
    templatesSection.classList.add("fade-in")
    generateTemplatesPreviews()

    // Scroll to templates
    templatesSection.scrollIntoView({ behavior: "smooth" })
  }
}

// Navigate between form steps
function changeStep(direction) {
  if (direction === 1 && !validateCurrentStep()) {
    return
  }

  const currentStepElement = document.getElementById(`step${currentStep}`)
  currentStepElement.classList.remove("active")

  // Update step indicator
  const currentIndicator = document.querySelector(`.step-indicator[data-step="${currentStep}"]`)
  currentIndicator.classList.remove("active")

  currentStep += direction

  if (currentStep < 1) currentStep = 1
  if (currentStep > totalSteps) currentStep = totalSteps

  const newStepElement = document.getElementById(`step${currentStep}`)
  newStepElement.classList.add("active")

  // Update step indicator
  const newIndicator = document.querySelector(`.step-indicator[data-step="${currentStep}"]`)
  newIndicator.classList.add("active")

  updateProgress()
  updateNavigationButtons()

  // Scroll to form
  document.getElementById("cv-form").scrollIntoView({ behavior: "smooth", block: "start" })
}

// Update progress bar
function updateProgress() {
  const progress = (currentStep / totalSteps) * 100
  document.getElementById("progress").style.width = `${progress}%`
  document.getElementById("currentStepNum").textContent = currentStep
}

// Update navigation buttons
function updateNavigationButtons() {
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const generateBtn = document.getElementById("generateBtn")

  prevBtn.style.display = currentStep === 1 ? "none" : "inline-flex"
  nextBtn.style.display = currentStep === totalSteps ? "none" : "inline-flex"
  generateBtn.style.display = currentStep === totalSteps ? "inline-flex" : "none"
}

// Validate current step
function validateCurrentStep() {
  const currentStepElement = document.getElementById(`step${currentStep}`)
  const requiredFields = currentStepElement.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add("invalid")
      field.classList.remove("valid")
      isValid = false
    } else {
      field.classList.add("valid")
      field.classList.remove("invalid")
    }
  })

  if (!isValid) {
    showNotification("Veuillez remplir tous les champs obligatoires", "error")
    // Focus on first invalid field
    const firstInvalid = currentStepElement.querySelector(".invalid")
    if (firstInvalid) {
      firstInvalid.focus()
    }
  }

  return isValid
}

// Validate individual field
function validateField(e) {
  const field = e.target
  const value = field.value.trim()

  if (field.hasAttribute("required") && !value) {
    field.classList.add("invalid")
    field.classList.remove("valid")
    return false
  }

  // Email validation
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      field.classList.add("invalid")
      field.classList.remove("valid")
      return false
    }
  }

  // Phone validation
  if (field.type === "tel" && value) {
    const phoneRegex = /^[+]?[0-9\s\-()]{8,}$/
    if (!phoneRegex.test(value)) {
      field.classList.add("invalid")
      field.classList.remove("valid")
      return false
    }
  }

  field.classList.add("valid")
  field.classList.remove("invalid")
  return true
}

// Handle input changes for real-time validation
function handleInputChange(e) {
  const field = e.target

  // Remove invalid class on input
  if (field.classList.contains("invalid")) {
    field.classList.remove("invalid")
  }

  // Add valid class if field has value and is valid
  if (field.value.trim() && validateField(e)) {
    field.classList.add("valid")
  }
}

// Add new education entry
function addEducation() {
  const container = document.getElementById("educationContainer")
  const newEducation = document.createElement("div")
  newEducation.className = "education-item"
  newEducation.innerHTML = `
        <div class="item-header">
            <h4><i class="fas fa-graduation-cap"></i> Formation #${educationCount + 1}</h4>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label>Diplôme/Formation *</label>
                <input type="text" name="education[${educationCount}][degree]" placeholder="Ex: Licence en Économie" required>
            </div>
            <div class="form-group">
                <label>Établissement *</label>
                <input type="text" name="education[${educationCount}][school]" placeholder="Ex: Faculté des Sciences Économiques de Tunis" required>
            </div>
            <div class="form-group">
                <label>Spécialisation</label>
                <input type="text" name="education[${educationCount}][specialization]" placeholder="Ex: Finance">
            </div>
            <div class="form-group">
                <label>Mention</label>
                <select name="education[${educationCount}][grade]">
                    <option value="">Sélectionnez</option>
                    <option value="Très Bien">Très Bien</option>
                    <option value="Bien">Bien</option>
                    <option value="Assez Bien">Assez Bien</option>
                    <option value="Passable">Passable</option>
                </select>
            </div>
            <div class="form-group">
                <label>Année de début</label>
                <input type="number" name="education[${educationCount}][startYear]" min="1990" max="2030" placeholder="2018">
            </div>
            <div class="form-group">
                <label>Année de fin</label>
                <input type="number" name="education[${educationCount}][endYear]" min="1990" max="2030" placeholder="2021">
            </div>
            <div class="form-group full-width">
                <label>Description (optionnel)</label>
                <textarea name="education[${educationCount}][description]" rows="3" placeholder="Projets réalisés, cours pertinents, activités extra-scolaires..."></textarea>
            </div>
            <div class="form-group full-width">
                <button type="button" class="btn-remove" onclick="removeEducation(this)">
                    <i class="fas fa-trash"></i> Supprimer cette formation
                </button>
            </div>
        </div>
    `
  container.appendChild(newEducation)
  educationCount++

  // Add event listeners to new inputs
  const newInputs = newEducation.querySelectorAll("input, select, textarea")
  newInputs.forEach((input) => {
    input.addEventListener("blur", validateField)
    input.addEventListener("input", handleInputChange)
  })

  // Animate the new item
  newEducation.style.opacity = "0"
  newEducation.style.transform = "translateY(20px)"
  setTimeout(() => {
    newEducation.style.transition = "all 0.3s ease"
    newEducation.style.opacity = "1"
    newEducation.style.transform = "translateY(0)"
  }, 100)
}

// Remove education entry
function removeEducation(button) {
  const item = button.closest(".education-item")
  item.style.transition = "all 0.3s ease"
  item.style.opacity = "0"
  item.style.transform = "translateY(-20px)"
  setTimeout(() => {
    item.remove()
  }, 300)
}

// Add new experience entry
function addExperience() {
  const container = document.getElementById("experienceContainer")
  const newExperience = document.createElement("div")
  newExperience.className = "experience-item"
  newExperience.innerHTML = `
        <div class="item-header">
            <h4><i class="fas fa-briefcase"></i> Expérience #${experienceCount + 1}</h4>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label>Poste *</label>
                <input type="text" name="experience[${experienceCount}][position]" placeholder="Ex: Analyste financier" required>
            </div>
            <div class="form-group">
                <label>Entreprise *</label>
                <input type="text" name="experience[${experienceCount}][company]" placeholder="Ex: Banque de Tunisie" required>
            </div>
            <div class="form-group">
                <label>Secteur d'activité</label>
                <input type="text" name="experience[${experienceCount}][industry]" placeholder="Ex: Services financiers">
            </div>
            <div class="form-group">
                <label>Lieu</label>
                <input type="text" name="experience[${experienceCount}][location]" placeholder="Ex: Tunis, Tunisie">
            </div>
            <div class="form-group">
                <label>Date de début</label>
                <input type="month" name="experience[${experienceCount}][startDate]">
            </div>
            <div class="form-group">
                <label>Date de fin</label>
                <input type="month" name="experience[${experienceCount}][endDate]">
                <label class="checkbox-label">
                    <input type="checkbox" name="experience[${experienceCount}][current]"> Poste actuel
                </label>
            </div>
            <div class="form-group full-width">
                <label>Description des tâches et réalisations</label>
                <textarea name="experience[${experienceCount}][description]" rows="4" placeholder="• Analyse des données financières et préparation de rapports&#10;• Gestion de portefeuille clients de 50M TND&#10;• Amélioration des processus de 25%"></textarea>
            </div>
            <div class="form-group full-width">
                <button type="button" class="btn-remove" onclick="removeExperience(this)">
                    <i class="fas fa-trash"></i> Supprimer cette expérience
                </button>
            </div>
        </div>
    `
  container.appendChild(newExperience)
  experienceCount++

  // Add event listeners to new inputs
  const newInputs = newExperience.querySelectorAll("input, select, textarea")
  newInputs.forEach((input) => {
    input.addEventListener("blur", validateField)
    input.addEventListener("input", handleInputChange)
  })

  // Animate the new item
  newExperience.style.opacity = "0"
  newExperience.style.transform = "translateY(20px)"
  setTimeout(() => {
    newExperience.style.transition = "all 0.3s ease"
    newExperience.style.opacity = "1"
    newExperience.style.transform = "translateY(0)"
  }, 100)
}

// Remove experience entry
function removeExperience(button) {
  const item = button.closest(".experience-item")
  item.style.transition = "all 0.3s ease"
  item.style.opacity = "0"
  item.style.transform = "translateY(-20px)"
  setTimeout(() => {
    item.remove()
  }, 300)
}

// Add new language
function addLanguage() {
  const container = document.querySelector(".language-inputs")
  const newLanguage = document.createElement("div")
  newLanguage.className = "language-item"
  newLanguage.innerHTML = `
        <input type="text" name="languages[${languageCount}][name]" placeholder="Ex: Allemand">
        <select name="languages[${languageCount}][level]">
            <option value="Natif">Natif</option>
            <option value="Courant">Courant</option>
            <option value="Intermédiaire" selected>Intermédiaire</option>
            <option value="Débutant">Débutant</option>
        </select>
        <button type="button" class="btn-remove" onclick="removeLanguage(this)" style="grid-column: 1 / -1; margin-top: 0.5rem;">
            <i class="fas fa-trash"></i> Supprimer
        </button>
    `
  container.appendChild(newLanguage)
  languageCount++

  // Animate the new item
  newLanguage.style.opacity = "0"
  newLanguage.style.transform = "translateY(10px)"
  setTimeout(() => {
    newLanguage.style.transition = "all 0.3s ease"
    newLanguage.style.opacity = "1"
    newLanguage.style.transform = "translateY(0)"
  }, 100)
}

// Remove language
function removeLanguage(button) {
  const item = button.closest(".language-item")
  item.style.transition = "all 0.3s ease"
  item.style.opacity = "0"
  item.style.transform = "translateY(-10px)"
  setTimeout(() => {
    item.remove()
  }, 300)
}

// Collect form data with chronological sorting
function collectFormData() {
  const form = document.getElementById("cvForm")
  const formDataObj = new FormData(form)
  const data = {}

  // Basic information
  data.firstName = formDataObj.get("firstName")
  data.lastName = formDataObj.get("lastName")
  data.email = formDataObj.get("email")
  data.phone = formDataObj.get("phone")
  data.address = formDataObj.get("address")
  data.city = formDataObj.get("city")
  data.profileType = formDataObj.get("profileType")
  data.jobTitle = formDataObj.get("jobTitle")
  data.objective = formDataObj.get("objective")

  // Skills
  data.technicalSkills = formDataObj.get("technicalSkills")
  data.softSkills = formDataObj.get("softSkills")
  data.certifications = formDataObj.get("certifications")

  // Languages
  data.languages = []
  let i = 0
  while (formDataObj.get(`languages[${i}][name]`) !== null) {
    const lang = {
      name: formDataObj.get(`languages[${i}][name]`),
      level: formDataObj.get(`languages[${i}][level]`),
    }
    if (lang.name && lang.name.trim()) {
      data.languages.push(lang)
    }
    i++
  }

  // Education - Sort by end year (most recent first)
  data.education = []
  i = 0
  while (formDataObj.get(`education[${i}][degree]`) !== null) {
    const edu = {
      degree: formDataObj.get(`education[${i}][degree]`),
      school: formDataObj.get(`education[${i}][school]`),
      specialization: formDataObj.get(`education[${i}][specialization]`),
      grade: formDataObj.get(`education[${i}][grade]`),
      startYear: Number.parseInt(formDataObj.get(`education[${i}][startYear]`)) || 0,
      endYear: Number.parseInt(formDataObj.get(`education[${i}][endYear]`)) || 0,
      description: formDataObj.get(`education[${i}][description]`),
    }
    if (edu.degree || edu.school) {
      data.education.push(edu)
    }
    i++
  }

  // Sort education by end year (most recent first)
  data.education.sort((a, b) => b.endYear - a.endYear)

  // Experience - Sort by start date (most recent first)
  data.experience = []
  i = 0
  while (formDataObj.get(`experience[${i}][position]`) !== null) {
    const exp = {
      position: formDataObj.get(`experience[${i}][position]`),
      company: formDataObj.get(`experience[${i}][company]`),
      industry: formDataObj.get(`experience[${i}][industry]`),
      location: formDataObj.get(`experience[${i}][location]`),
      startDate: formDataObj.get(`experience[${i}][startDate]`),
      endDate: formDataObj.get(`experience[${i}][endDate]`),
      current: formDataObj.get(`experience[${i}][current]`) === "on",
      description: formDataObj.get(`experience[${i}][description]`),
    }
    if (exp.position || exp.company) {
      data.experience.push(exp)
    }
    i++
  }

  // Sort experience by start date (most recent first)
  data.experience.sort((a, b) => {
    const dateA = new Date(a.startDate || "1900-01")
    const dateB = new Date(b.startDate || "1900-01")
    return dateB - dateA
  })

  // Add photo
  data.photo = userPhoto

  return data
}

// Generate CVs
function generateCVs() {
  if (!validateCurrentStep()) {
    return
  }

  formData = collectFormData()

  // Show loading
  const generateBtn = document.getElementById("generateBtn")
  const originalText = generateBtn.innerHTML
  generateBtn.innerHTML = '<div class="loading"></div> Génération en cours...'
  generateBtn.disabled = true

  setTimeout(() => {
    document.getElementById("cv-form").style.display = "none"
    document.getElementById("cv-preview").style.display = "block"
    document.getElementById("cv-preview").classList.add("fade-in")

    generateTemplatesPreviews()

    generateBtn.innerHTML = originalText
    generateBtn.disabled = false

    // Scroll to preview
    document.getElementById("cv-preview").scrollIntoView({ behavior: "smooth" })
  }, 2000)
}

// Generate templates previews
function generateTemplatesPreviews() {
  const templates = ["modern", "creative", "professional", "minimalist", "executive"]

  templates.forEach((template) => {
    const preview = document.getElementById(`${template}-preview`)
    const previewContent = preview.querySelector(".preview-content")
    if (previewContent) {
      previewContent.innerHTML += generatePreviewHTML(template)
    }
  })
}

// Generate preview HTML for each template
function generatePreviewHTML(template) {
  const name = `${formData.firstName} ${formData.lastName}`
  const profile = getProfileLabel(formData.profileType)
  const jobTitle = formData.jobTitle || profile

  let html = `
        <div class="cv-preview-${template}" style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px;">
            <div style="font-weight: bold; margin-bottom: 0.5rem;">${name}</div>
            <div style="font-size: 0.9rem; margin-bottom: 0.5rem;">${jobTitle}</div>
            <div style="font-size: 0.8rem; opacity: 0.8;">${formData.email}</div>
    `

  if (formData.objective) {
    html += `<div style="font-size: 0.8rem; margin-top: 0.5rem; font-style: italic;">"${formData.objective.substring(0, 80)}..."</div>`
  }

  html += "</div>"

  return html
}

// Get profile label
function getProfileLabel(profileType) {
  const labels = {
    etudiant: "Étudiant",
    "diplome-bac": "Bachelier",
    "diplome-bts": "Titulaire BTS/DUT",
    "diplome-licence": "Licencié",
    "diplome-master": "Master",
    "diplome-doctorat": "Docteur",
    "diplome-ingenieur": "Ingénieur",
    "non-diplome": "Professionnel",
    professionnel: "Professionnel expérimenté",
  }
  return labels[profileType] || "Professionnel"
}

// Select template
function selectTemplate(template) {
  const card = document.querySelector(`[data-template="${template}"]`)
  const downloadBtn = card.querySelector(".btn-download")

  if (selectedTemplates.includes(template)) {
    // Deselect
    selectedTemplates = selectedTemplates.filter((t) => t !== template)
    card.classList.remove("selected")
    downloadBtn.disabled = true
  } else {
    // Select
    selectedTemplates.push(template)
    card.classList.add("selected")
    downloadBtn.disabled = false
  }

  const action = selectedTemplates.includes(template) ? "sélectionné" : "désélectionné"
  showNotification(`Template ${template} ${action}`, "success")
}

// Download single CV
function downloadCV(template) {
  if (!selectedTemplates.includes(template)) {
    showNotification("Veuillez d'abord sélectionner ce template", "error")
    return
  }

  generatePDF(template)
}

// Download all selected CVs
function downloadAllSelected() {
  if (selectedTemplates.length === 0) {
    showNotification("Veuillez sélectionner au moins un template", "error")
    return
  }

  selectedTemplates.forEach((template, index) => {
    setTimeout(() => {
      generatePDF(template)
    }, index * 1000) // Delay to avoid browser blocking multiple downloads
  })

  showNotification(`${selectedTemplates.length} CV(s) en cours de téléchargement`, "success")
}

// Enhanced PDF generation with all 5 templates
function generatePDF(template) {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()

  // Set font
  doc.setFont("helvetica")

  const yPosition = 20
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margin = 20
  const contentWidth = pageWidth - margin * 2

  // Generate PDF based on template
  switch (template) {
    case "modern":
      generateModernPDF(doc, yPosition, margin, contentWidth, pageHeight)
      break
    case "creative":
      generateCreativePDF(doc, yPosition, margin, contentWidth, pageHeight)
      break
    case "professional":
      generateProfessionalPDF(doc, yPosition, margin, contentWidth, pageHeight)
      break
    case "minimalist":
      generateMinimalistPDF(doc, yPosition, margin, contentWidth, pageHeight)
      break
    case "executive":
      generateExecutivePDF(doc, yPosition, margin, contentWidth, pageHeight)
      break
    default:
      generateModernPDF(doc, yPosition, margin, contentWidth, pageHeight)
  }

  // Save the PDF
  const fileName = `CV_${formData.firstName}_${formData.lastName}_${template}.pdf`
  doc.save(fileName)
}

// Modern Template PDF
function generateModernPDF(doc, yPos, margin, contentWidth, pageHeight) {
  let y = yPos

  // Header with gradient effect (simulated with color)
  doc.setFillColor(99, 102, 241)
  doc.rect(0, 0, doc.internal.pageSize.width, 50, "F")

  // Add photo if available
  if (formData.photo) {
    try {
      doc.addImage(formData.photo, "JPEG", margin, 10, 30, 30)
    } catch (e) {
      console.log("Error adding photo:", e)
    }
  }

  // Name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  const nameX = formData.photo ? margin + 40 : margin
  doc.text(`${formData.firstName} ${formData.lastName}`, nameX, 25)

  // Job title
  if (formData.jobTitle) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    doc.text(formData.jobTitle, nameX, 35)
  }

  y = 60
  doc.setTextColor(0, 0, 0)

  // Contact info
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`📧 ${formData.email}`, margin, y)
  y += 6
  doc.text(`📱 ${formData.phone}`, margin, y)
  y += 6
  if (formData.address && formData.city) {
    doc.text(`📍 ${formData.address}, ${formData.city}`, margin, y)
    y += 6
  }

  y += 10

  // Continue with rest of content...
  y = addObjectiveSection(doc, y, margin, contentWidth)
  y = addEducationSection(doc, y, margin, contentWidth, pageHeight)
  y = addExperienceSection(doc, y, margin, contentWidth, pageHeight)
  y = addSkillsSection(doc, y, margin, contentWidth, pageHeight)
}

// Creative Template PDF
function generateCreativePDF(doc, yPos, margin, contentWidth, pageHeight) {
  let y = yPos

  // Creative header with different colors
  doc.setFillColor(245, 87, 108)
  doc.rect(0, 0, doc.internal.pageSize.width, 45, "F")

  // Add photo if available
  if (formData.photo) {
    try {
      doc.addImage(formData.photo, "JPEG", margin, 8, 25, 30)
    } catch (e) {
      console.log("Error adding photo:", e)
    }
  }

  // Name in white
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  const nameX = formData.photo ? margin + 35 : margin
  doc.text(`${formData.firstName} ${formData.lastName}`, nameX, 22)

  // Job title
  if (formData.jobTitle) {
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(formData.jobTitle, nameX, 32)
  }

  y = 55
  doc.setTextColor(0, 0, 0)

  // Contact with creative icons
  doc.setFontSize(10)
  doc.text(`✉ ${formData.email} | ☎ ${formData.phone}`, margin, y)
  if (formData.address && formData.city) {
    y += 5
    doc.text(`⌂ ${formData.address}, ${formData.city}`, margin, y)
  }

  y += 15

  // Continue with rest of content...
  y = addObjectiveSection(doc, y, margin, contentWidth)
  y = addEducationSection(doc, y, margin, contentWidth, pageHeight)
  y = addExperienceSection(doc, y, margin, contentWidth, pageHeight)
  y = addSkillsSection(doc, y, margin, contentWidth, pageHeight)
}

// Professional Template PDF
function generateProfessionalPDF(doc, yPos, margin, contentWidth, pageHeight) {
  let y = yPos

  // Professional header
  doc.setFillColor(55, 65, 81)
  doc.rect(0, 0, doc.internal.pageSize.width, 40, "F")

  // Add photo if available
  if (formData.photo) {
    try {
      doc.addImage(formData.photo, "JPEG", margin, 5, 30, 30)
    } catch (e) {
      console.log("Error adding photo:", e)
    }
  }

  // Name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  const nameX = formData.photo ? margin + 40 : margin
  doc.text(`${formData.firstName} ${formData.lastName}`, nameX, 20)

  // Job title
  if (formData.jobTitle) {
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(formData.jobTitle, nameX, 30)
  }

  y = 50
  doc.setTextColor(0, 0, 0)

  // Professional line separator
  doc.setLineWidth(1)
  doc.setDrawColor(55, 65, 81)
  doc.line(margin, y, margin + contentWidth, y)
  y += 10

  // Contact info in professional format
  doc.setFontSize(10)
  doc.text(`Email: ${formData.email} | Téléphone: ${formData.phone}`, margin, y)
  if (formData.address && formData.city) {
    y += 5
    doc.text(`Adresse: ${formData.address}, ${formData.city}`, margin, y)
  }

  y += 15

  // Continue with rest of content...
  y = addObjectiveSection(doc, y, margin, contentWidth)
  y = addEducationSection(doc, y, margin, contentWidth, pageHeight)
  y = addExperienceSection(doc, y, margin, contentWidth, pageHeight)
  y = addSkillsSection(doc, y, margin, contentWidth, pageHeight)
}

// Minimalist Template PDF
function generateMinimalistPDF(doc, yPos, margin, contentWidth, pageHeight) {
  let y = yPos

  // Simple header
  doc.setFontSize(26)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text(`${formData.firstName} ${formData.lastName}`, margin, y)
  y += 10

  // Job title
  if (formData.jobTitle) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)
    doc.text(formData.jobTitle, margin, y)
    y += 8
  }

  // Simple line
  doc.setLineWidth(0.5)
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, y, margin + contentWidth, y)
  y += 10

  // Add photo if available (smaller for minimalist)
  if (formData.photo) {
    try {
      doc.addImage(formData.photo, "JPEG", margin + contentWidth - 25, 20, 20, 25)
    } catch (e) {
      console.log("Error adding photo:", e)
    }
  }

  // Contact info
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text(`${formData.email} • ${formData.phone}`, margin, y)
  if (formData.address && formData.city) {
    y += 5
    doc.text(`${formData.address}, ${formData.city}`, margin, y)
  }

  y += 15

  // Continue with rest of content...
  y = addObjectiveSection(doc, y, margin, contentWidth)
  y = addEducationSection(doc, y, margin, contentWidth, pageHeight)
  y = addExperienceSection(doc, y, margin, contentWidth, pageHeight)
  y = addSkillsSection(doc, y, margin, contentWidth, pageHeight)
}

// Executive Template PDF
function generateExecutivePDF(doc, yPos, margin, contentWidth, pageHeight) {
  let y = yPos

  // Executive header with luxury feel
  doc.setFillColor(124, 58, 237)
  doc.rect(0, 0, doc.internal.pageSize.width, 55, "F")

  // Add photo if available
  if (formData.photo) {
    try {
      doc.addImage(formData.photo, "JPEG", margin, 10, 35, 35)
    } catch (e) {
      console.log("Error adding photo:", e)
    }
  }

  // Name with executive styling
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(30)
  doc.setFont("helvetica", "bold")
  const nameX = formData.photo ? margin + 45 : margin
  doc.text(`${formData.firstName} ${formData.lastName}`, nameX, 28)

  // Job title
  if (formData.jobTitle) {
    doc.setFontSize(16)
    doc.setFont("helvetica", "normal")
    doc.text(formData.jobTitle, nameX, 40)
  }

  y = 65
  doc.setTextColor(0, 0, 0)

  // Executive contact format
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("CONTACT", margin, y)
  y += 8
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Email: ${formData.email}`, margin, y)
  y += 5
  doc.text(`Mobile: ${formData.phone}`, margin, y)
  if (formData.address && formData.city) {
    y += 5
    doc.text(`Adresse: ${formData.address}, ${formData.city}`, margin, y)
  }

  y += 15

  // Continue with rest of content...
  y = addObjectiveSection(doc, y, margin, contentWidth)
  y = addEducationSection(doc, y, margin, contentWidth, pageHeight)
  y = addExperienceSection(doc, y, margin, contentWidth, pageHeight)
  y = addSkillsSection(doc, y, margin, contentWidth, pageHeight)
}

// Helper functions for PDF sections
function addObjectiveSection(doc, y, margin, contentWidth) {
  if (formData.objective) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("OBJECTIF PROFESSIONNEL", margin, y)
    y += 8
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const objectiveLines = doc.splitTextToSize(formData.objective, contentWidth)
    doc.text(objectiveLines, margin, y)
    y += objectiveLines.length * 5 + 10
  }
  return y
}

function addEducationSection(doc, y, margin, contentWidth, pageHeight) {
  if (formData.education.length > 0) {
    // Check if we need a new page
    if (y > pageHeight - 60) {
      doc.addPage()
      y = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("FORMATION", margin, y)
    y += 8

    formData.education.forEach((edu) => {
      if (edu.degree || edu.school) {
        // Check if we need a new page
        if (y > pageHeight - 40) {
          doc.addPage()
          y = 20
        }

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        let degreeText = edu.degree || "Formation"
        if (edu.specialization) {
          degreeText += ` - ${edu.specialization}`
        }
        doc.text(degreeText, margin, y)
        y += 6

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        if (edu.school) {
          doc.text(edu.school, margin, y)
          y += 5
        }

        let dateText = ""
        if (edu.startYear && edu.endYear) {
          dateText = `${edu.startYear} - ${edu.endYear}`
        } else if (edu.endYear) {
          dateText = `Diplômé en ${edu.endYear}`
        }

        if (edu.grade) {
          dateText += edu.grade ? ` | Mention: ${edu.grade}` : ""
        }

        if (dateText) {
          doc.text(dateText, margin, y)
          y += 5
        }

        if (edu.description) {
          const descLines = doc.splitTextToSize(edu.description, contentWidth)
          doc.text(descLines, margin, y)
          y += descLines.length * 4
        }
        y += 8
      }
    })
    y += 5
  }
  return y
}

function addExperienceSection(doc, y, margin, contentWidth, pageHeight) {
  if (formData.experience.length > 0) {
    // Check if we need a new page
    if (y > pageHeight - 60) {
      doc.addPage()
      y = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("EXPÉRIENCE PROFESSIONNELLE", margin, y)
    y += 8

    formData.experience.forEach((exp) => {
      if (exp.position || exp.company) {
        // Check if we need a new page
        if (y > pageHeight - 50) {
          doc.addPage()
          y = 20
        }

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.text(exp.position || "Poste", margin, y)
        y += 6

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        let companyText = exp.company || ""
        if (exp.location) {
          companyText += ` | ${exp.location}`
        }
        if (companyText) {
          doc.text(companyText, margin, y)
          y += 5
        }

        if (exp.startDate || exp.endDate || exp.current) {
          const startDate = exp.startDate
            ? new Date(exp.startDate).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
            : ""
          const endDate = exp.current
            ? "Actuellement"
            : exp.endDate
              ? new Date(exp.endDate).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
              : ""
          const dateText = `${startDate} - ${endDate}`
          doc.text(dateText, margin, y)
          y += 5
        }

        if (exp.description) {
          const descLines = doc.splitTextToSize(exp.description, contentWidth)
          doc.text(descLines, margin, y)
          y += descLines.length * 4
        }
        y += 8
      }
    })
    y += 5
  }
  return y
}

function addSkillsSection(doc, y, margin, contentWidth, pageHeight) {
  // Check if we need a new page
  if (y > pageHeight - 80) {
    doc.addPage()
    y = 20
  }

  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("COMPÉTENCES", margin, y)
  y += 8

  if (formData.technicalSkills) {
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("Compétences techniques:", margin, y)
    y += 6
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const techLines = doc.splitTextToSize(formData.technicalSkills, contentWidth)
    doc.text(techLines, margin, y)
    y += techLines.length * 4 + 8
  }

  if (formData.languages && formData.languages.length > 0) {
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("Langues:", margin, y)
    y += 6
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const languageText = formData.languages.map((lang) => `${lang.name} (${lang.level})`).join(", ")
    const langLines = doc.splitTextToSize(languageText, contentWidth)
    doc.text(langLines, margin, y)
    y += langLines.length * 4 + 8
  }

  if (formData.softSkills) {
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("Compétences personnelles:", margin, y)
    y += 6
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const softLines = doc.splitTextToSize(formData.softSkills, contentWidth)
    doc.text(softLines, margin, y)
    y += softLines.length * 4 + 8
  }

  if (formData.certifications) {
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("Certifications:", margin, y)
    y += 6
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const certLines = doc.splitTextToSize(formData.certifications, contentWidth)
    doc.text(certLines, margin, y)
    y += certLines.length * 4
  }

  return y
}

// Go back to form
function goBackToForm() {
  document.getElementById("cv-preview").style.display = "none"
  document.getElementById("cv-form").style.display = "block"
  selectedTemplates = []

  // Reset template selections
  document.querySelectorAll(".template-card").forEach((card) => {
    card.classList.remove("selected")
    card.querySelector(".btn-download").disabled = true
  })

  // Scroll to form
  document.getElementById("cv-form").scrollIntoView({ behavior: "smooth" })
}

// Enhanced notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => {
    notification.remove()
  })

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`

  const icon =
    type === "success"
      ? "check-circle"
      : type === "error"
        ? "exclamation-circle"
        : type === "warning"
          ? "exclamation-triangle"
          : "info-circle"

  notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `

  // Add to page
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.animation = "slideIn 0.3s ease-out"
  }, 100)

  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-in"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

// Add CSS animations for notifications
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Initialize navigation
updateNavigationButtons()

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add loading states for better UX
function addLoadingState(button) {
  const originalText = button.innerHTML
  button.innerHTML = '<div class="loading"></div> Chargement...'
  button.disabled = true

  return function removeLoadingState() {
    button.innerHTML = originalText
    button.disabled = false
  }
}

// Initialize tooltips (if needed)
function initializeTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]")
  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip)
    element.addEventListener("mouseleave", hideTooltip)
  })
}

function showTooltip(e) {
  const tooltip = document.createElement("div")
  tooltip.className = "tooltip"
  tooltip.textContent = e.target.getAttribute("data-tooltip")
  document.body.appendChild(tooltip)

  const rect = e.target.getBoundingClientRect()
  tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
  tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px"
}

function hideTooltip() {
  const tooltip = document.querySelector(".tooltip")
  if (tooltip) {
    tooltip.remove()
  }
}

// Performance optimization: Lazy load images
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading if supported
if ("IntersectionObserver" in window) {
  document.addEventListener("DOMContentLoaded", lazyLoadImages)
}
