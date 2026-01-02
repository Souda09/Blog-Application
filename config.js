import {createClient} from  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"                              //"https://esm.sh/@supabase/supabase-js";
console.log(createClient)

const supaURL = 'https://glpihhtjipjnkglrkbaw.supabase.co'
const supaKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscGloaHRqaXBqbmtnbHJrYmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNDY1NzQsImV4cCI6MjA3NTkyMjU3NH0.PtugLdOh5FgIe_cUFZLTcFcL1jue7vut9ephGoBpjXM'

// initialization
const supabase = createClient(supaURL,supaKey)

 export default supabase;