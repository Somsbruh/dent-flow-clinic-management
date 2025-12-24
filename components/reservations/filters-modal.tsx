"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Plus, Trash2, Check, Users, CalendarOff, Settings, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { holidays, staffDayOffs, staff } from "@/lib/data"
import type { Holiday, StaffDayOff } from "@/lib/data"

interface FiltersModalProps {
  isOpen: boolean
  onClose: () => void
  workingHours: { start: string; end: string }
  onWorkingHoursChange: (hours: { start: string; end: string }) => void
  breakTime: { start: string; end: string }
  onBreakTimeChange: (breakTime: { start: string; end: string }) => void
}

export function FiltersModal({
  isOpen,
  onClose,
  workingHours,
  onWorkingHoursChange,
  breakTime,
  onBreakTimeChange,
}: FiltersModalProps) {
  const [activeTab, setActiveTab] = useState("settings")

  // Holidays state
  const [holidaysList, setHolidaysList] = useState<Holiday[]>(holidays)
  const [newHoliday, setNewHoliday] = useState({ name: "", date: "", isRecurring: true })

  // Day offs state
  const [dayOffsList, setDayOffsList] = useState<StaffDayOff[]>(staffDayOffs)
  const [newDayOff, setNewDayOff] = useState({ staffId: "", date: "", reason: "vacation" as const, notes: "" })

  // Settings state
  const [showWeekends, setShowWeekends] = useState(true)
  const [autoApproveLeave, setAutoApproveLeave] = useState(false)
  const [localBreakTime, setLocalBreakTime] = useState(breakTime)

  const [localWorkingHours, setLocalWorkingHours] = useState(workingHours)

  useEffect(() => {
    setLocalBreakTime(breakTime)
  }, [breakTime])

  useEffect(() => {
    setLocalWorkingHours(workingHours)
  }, [workingHours])

  // Holiday handlers
  const handleAddHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) return
    const holiday: Holiday = {
      id: `H${Date.now()}`,
      name: newHoliday.name,
      date: newHoliday.date,
      isRecurring: newHoliday.isRecurring,
    }
    setHolidaysList([...holidaysList, holiday])
    setNewHoliday({ name: "", date: "", isRecurring: true })
  }

  const handleDeleteHoliday = (id: string) => {
    setHolidaysList(holidaysList.filter((h) => h.id !== id))
  }

  // Day off handlers
  const handleAddDayOff = () => {
    if (!newDayOff.staffId || !newDayOff.date) return
    const staffMember = staff.find((s) => s.id === newDayOff.staffId)
    const dayOff: StaffDayOff = {
      id: `DO${Date.now()}`,
      staffId: newDayOff.staffId,
      staffName: staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : "",
      date: newDayOff.date,
      reason: newDayOff.reason,
      isApproved: autoApproveLeave,
      notes: newDayOff.notes || undefined,
    }
    setDayOffsList([...dayOffsList, dayOff])
    setNewDayOff({ staffId: "", date: "", reason: "vacation", notes: "" })
  }

  const handleApproveDayOff = (id: string) => {
    setDayOffsList(dayOffsList.map((d) => (d.id === id ? { ...d, isApproved: true } : d)))
  }

  const handleDeleteDayOff = (id: string) => {
    setDayOffsList(dayOffsList.filter((d) => d.id !== id))
  }

  const handleSave = () => {
    onWorkingHoursChange(localWorkingHours)
    onBreakTimeChange(localBreakTime)
    onClose()
  }

  const getReasonBadgeColor = (reason: string) => {
    switch (reason) {
      case "vacation":
        return "bg-blue-100 text-blue-700"
      case "sick":
        return "bg-rose-100 text-rose-700"
      case "personal":
        return "bg-purple-100 text-purple-700"
      case "training":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const timeOptions = []
  for (let h = 5; h <= 22; h++) {
    timeOptions.push(`${h.toString().padStart(2, "0")}:00`)
    timeOptions.push(`${h.toString().padStart(2, "0")}:30`)
  }

  const formatTime = (time: string) => {
    const hour = Number.parseInt(time.split(":")[0])
    const min = time.split(":")[1]
    if (hour < 12) return `${hour}:${min} AM`
    if (hour === 12) return `12:${min} PM`
    return `${hour - 12}:${min} PM`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Schedule Filters & Settings</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="holidays" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Holidays
            </TabsTrigger>
            <TabsTrigger value="dayoffs" className="flex items-center gap-2">
              <CalendarOff className="h-4 w-4" />
              Staff Day Offs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="flex-1 overflow-y-auto space-y-4">
            <div className="space-y-4">
              {/* Working Hours */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Clinic Working Hours</h4>
                </div>
                <p className="text-xs text-blue-700">Set the time range displayed on the reservation calendar</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-blue-700">Start Time</Label>
                    <Select
                      value={localWorkingHours.start}
                      onValueChange={(value) => setLocalWorkingHours({ ...localWorkingHours, start: value })}
                    >
                      <SelectTrigger className="bg-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions
                          .filter((t) => t.endsWith(":00"))
                          .map((time) => (
                            <SelectItem key={time} value={time}>
                              {formatTime(time)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-blue-700">End Time</Label>
                    <Select
                      value={localWorkingHours.end}
                      onValueChange={(value) => setLocalWorkingHours({ ...localWorkingHours, end: value })}
                    >
                      <SelectTrigger className="bg-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions
                          .filter((t) => t.endsWith(":00"))
                          .map((time) => (
                            <SelectItem key={time} value={time}>
                              {formatTime(time)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <h4 className="font-medium text-amber-900">Default Break Time</h4>
                </div>
                <p className="text-xs text-amber-700">
                  Set the lunch break time - this will reflect on the calendar immediately
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-amber-700">Break Start</Label>
                    <Select
                      value={localBreakTime.start}
                      onValueChange={(value) => setLocalBreakTime({ ...localBreakTime, start: value })}
                    >
                      <SelectTrigger className="bg-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {formatTime(time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-amber-700">Break End</Label>
                    <Select
                      value={localBreakTime.end}
                      onValueChange={(value) => setLocalBreakTime({ ...localBreakTime, end: value })}
                    >
                      <SelectTrigger className="bg-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {formatTime(time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-[10px] text-amber-600">
                  Current break: {formatTime(localBreakTime.start)} - {formatTime(localBreakTime.end)}
                </p>
              </div>

              {/* Display Settings */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <h4 className="font-medium text-gray-700">Display Settings</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900">Show Weekends</Label>
                    <p className="text-xs text-gray-500">Display Saturday and Sunday on calendar</p>
                  </div>
                  <Switch checked={showWeekends} onCheckedChange={setShowWeekends} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900">Auto-approve Leave Requests</Label>
                    <p className="text-xs text-gray-500">Automatically approve new day off requests</p>
                  </div>
                  <Switch checked={autoApproveLeave} onCheckedChange={setAutoApproveLeave} />
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <h4 className="font-medium text-gray-700">Weekly Schedule Overview</h4>
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                    <div
                      key={day}
                      className={cn(
                        "p-2 rounded",
                        i === 0 ? "bg-gray-200 text-gray-500" : "bg-white border border-gray-200",
                      )}
                    >
                      <p className="font-medium">{day}</p>
                      <p className="text-gray-500 mt-1">
                        {i === 0
                          ? "Closed"
                          : i === 6
                            ? `${Number.parseInt(localWorkingHours.start)}-14`
                            : `${Number.parseInt(localWorkingHours.start)}-${Number.parseInt(localWorkingHours.end)}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Holidays Tab */}
          <TabsContent value="holidays" className="flex-1 overflow-y-auto space-y-4">
            {/* Add new holiday form */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <h4 className="font-medium text-gray-700 text-sm">Add New Holiday</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Input
                    placeholder="Holiday name"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    value={newHoliday.date}
                    onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                    className="bg-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newHoliday.isRecurring}
                    onCheckedChange={(checked) => setNewHoliday({ ...newHoliday, isRecurring: checked })}
                  />
                  <Label className="text-sm text-gray-600">Recurring annually</Label>
                </div>
                <Button onClick={handleAddHoliday} size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Holiday
                </Button>
              </div>
            </div>

            {/* Holidays list */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 text-sm">Configured Holidays</h4>
              {holidaysList.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{holiday.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(holiday.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {holiday.isRecurring && <span className="ml-2 text-xs text-primary">(Recurring)</span>}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteHoliday(holiday.id)}
                    className="h-8 w-8 text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Staff Day Offs Tab */}
          <TabsContent value="dayoffs" className="flex-1 overflow-y-auto space-y-4">
            {/* Add new day off form */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <h4 className="font-medium text-gray-700 text-sm">Schedule Day Off</h4>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={newDayOff.staffId}
                  onValueChange={(value) => setNewDayOff({ ...newDayOff, staffId: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff
                      .filter((s) => s.role === "dentist" || s.role === "hygienist")
                      .map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.firstName} {s.lastName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={newDayOff.date}
                  onChange={(e) => setNewDayOff({ ...newDayOff, date: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={newDayOff.reason}
                  onValueChange={(value: any) => setNewDayOff({ ...newDayOff, reason: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Notes (optional)"
                  value={newDayOff.notes}
                  onChange={(e) => setNewDayOff({ ...newDayOff, notes: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddDayOff} size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-1" />
                  Schedule Day Off
                </Button>
              </div>
            </div>

            {/* Day offs list */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700 text-sm">Scheduled Day Offs</h4>
                <span className="text-xs text-gray-500">
                  {dayOffsList.filter((d) => !d.isApproved).length} pending approval
                </span>
              </div>
              {dayOffsList.map((dayOff) => (
                <div
                  key={dayOff.id}
                  className={cn(
                    "flex items-center justify-between p-3 bg-white border rounded-lg transition-colors",
                    dayOff.isApproved ? "border-gray-200 hover:border-gray-300" : "border-amber-200 bg-amber-50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        dayOff.isApproved ? "bg-gray-100" : "bg-amber-100",
                      )}
                    >
                      <Users className={cn("h-5 w-5", dayOff.isApproved ? "text-gray-600" : "text-amber-600")} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{dayOff.staffName}</p>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full capitalize",
                            getReasonBadgeColor(dayOff.reason),
                          )}
                        >
                          {dayOff.reason}
                        </span>
                        {!dayOff.isApproved && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Pending</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(dayOff.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {dayOff.notes && <span className="ml-2 text-xs">- {dayOff.notes}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!dayOff.isApproved && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleApproveDayOff(dayOff.id)}
                        className="h-8 w-8 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDayOff(dayOff.id)}
                      className="h-8 w-8 text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
